import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCamera, FiUpload, FiCheck, FiArrowLeft, FiInfo, 
  FiUser, FiCreditCard, FiEye, FiRefreshCw, FiVideo 
} from 'react-icons/fi';
import { Button } from '../components/Button';

interface CapturedDocument {
  file: File;
  preview: string;
  type: 'nin_front' | 'nin_back' | 'selfie' | 'video';
}

type VerificationStep = 'instructions' | 'nin_front' | 'nin_back' | 'selfie' | 'video' | 'nin_number' | 'review' | 'submit';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState<VerificationStep>('instructions');
  const [documents, setDocuments] = useState<{ [key: string]: CapturedDocument }>({});
  const [ninNumber, setNinNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Refs for camera access
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Start camera for document capture
  const startCamera = useCallback(async () => {
    try {
      const constraints = currentStep === 'selfie' || currentStep === 'video' 
        ? { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } }
        : { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please use file upload instead.');
    }
  }, [currentStep]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }, [stream, mediaRecorder]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    const steps: VerificationStep[] = ['instructions', 'nin_front', 'nin_back', 'selfie', 'video', 'nin_number', 'review', 'submit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `${currentStep}_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(blob);

      setDocuments(prev => ({
        ...prev,
        [currentStep]: {
          file,
          preview,
          type: currentStep as 'nin_front' | 'nin_back' | 'selfie' | 'video'
        }
      }));

      stopCamera();
      nextStep();
    }, 'image/jpeg', 0.8);
  }, [currentStep, stopCamera, nextStep]);

  // Start video recording
  const startRecording = useCallback(() => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
      const preview = URL.createObjectURL(blob);

      setDocuments(prev => ({
        ...prev,
        video: {
          file,
          preview,
          type: 'video'
        }
      }));

      stopCamera();
      nextStep();
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
        setIsRecording(false);
      }
    }, 30000);
  }, [stream, stopCamera, nextStep]);

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = currentStep === 'video';
    const validTypes = isVideo 
      ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi']
      : ['image/jpeg', 'image/jpg', 'image/png'];

    if (!validTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
      setError(`Please select a valid ${isVideo ? 'video' : 'image'} file`);
      return;
    }

    // Validate file size (max 10MB for video, 5MB for images)
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be less than ${isVideo ? '10MB' : '5MB'}`);
      return;
    }

    const preview = URL.createObjectURL(file);
    setDocuments(prev => ({
      ...prev,
      [currentStep]: {
        file,
        preview,
        type: currentStep as 'nin_front' | 'nin_back' | 'selfie' | 'video'
      }
    }));

    nextStep();
  };

  // Navigate to previous step
  const prevStep = () => {
    const steps: VerificationStep[] = ['instructions', 'nin_front', 'nin_back', 'selfie', 'video', 'nin_number', 'review', 'submit'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Retake photo/video
  const retakeMedia = (docType: string) => {
    if (documents[docType]) {
      URL.revokeObjectURL(documents[docType].preview);
      setDocuments(prev => {
        const newDocs = { ...prev };
        delete newDocs[docType];
        return newDocs;
      });
    }
    setCurrentStep(docType as VerificationStep);
  };

  // Submit verification
  const submitVerification = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate all required documents
      if (!documents.nin_front || !documents.nin_back || !documents.selfie) {
        setError('Please capture all required documents');
        return;
      }

      if (!ninNumber || ninNumber.length !== 11) {
        setError('Please enter a valid 11-digit NIN number');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('nin_front', documents.nin_front.file);
      formData.append('nin_back', documents.nin_back.file);
      formData.append('selfie', documents.selfie.file);
      if (documents.video) {
        formData.append('video', documents.video.file);
      }
      formData.append('nin_number', ninNumber);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/verification/submit-documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('craft_connect_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit verification');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      setError('Failed to submit verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
      Object.values(documents).forEach(doc => {
        URL.revokeObjectURL(doc.preview);
      });
    };
  }, [stopCamera, documents]);

  // Get step title and instructions
  const getStepInfo = () => {
    switch (currentStep) {
      case 'instructions':
        return {
          title: 'Identity Verification',
          subtitle: 'Verify your identity with your National Identification Number (NIN)',
          icon: <FiInfo className="w-8 h-8 text-blue-600" />
        };
      case 'nin_front':
        return {
          title: 'Scan NIN Front',
          subtitle: 'Take a clear photo of the front of your NIN card',
          icon: <FiCreditCard className="w-8 h-8 text-blue-600" />
        };
      case 'nin_back':
        return {
          title: 'Scan NIN Back',
          subtitle: 'Take a clear photo of the back of your NIN card',
          icon: <FiCreditCard className="w-8 h-8 text-blue-600" />
        };
      case 'selfie':
        return {
          title: 'Take Selfie',
          subtitle: 'Take a clear photo of your face for identity verification',
          icon: <FiUser className="w-8 h-8 text-blue-600" />
        };
      case 'video':
        return {
          title: 'Record Video (Optional)',
          subtitle: 'Record a short video saying your name for additional verification',
          icon: <FiVideo className="w-8 h-8 text-blue-600" />
        };
      case 'nin_number':
        return {
          title: 'Enter NIN Number',
          subtitle: 'Enter your 11-digit National Identification Number',
          icon: <FiCreditCard className="w-8 h-8 text-blue-600" />
        };
      case 'review':
        return {
          title: 'Review Documents',
          subtitle: 'Review your documents before submission',
          icon: <FiEye className="w-8 h-8 text-blue-600" />
        };
      default:
        return {
          title: 'Submit Verification',
          subtitle: 'Submit your documents for review',
          icon: <FiCheck className="w-8 h-8 text-green-600" />
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Profile
            </button>
            <div className="text-sm text-gray-500">
              Step {['instructions', 'nin_front', 'nin_back', 'selfie', 'video', 'nin_number', 'review', 'submit'].indexOf(currentStep) + 1} of 8
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((['instructions', 'nin_front', 'nin_back', 'selfie', 'video', 'nin_number', 'review', 'submit'].indexOf(currentStep) + 1) / 8) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {stepInfo.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{stepInfo.title}</h1>
          <p className="text-gray-600">{stepInfo.subtitle}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">
              <FiCheck className="w-4 h-4 inline mr-2" />
              Verification submitted successfully! Redirecting to profile...
            </p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Instructions Step */}
          {currentStep === 'instructions' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Need</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <FiCreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">NIN Card</h4>
                  <p className="text-sm text-gray-600">Front and back of your National ID card</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <FiUser className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Selfie Photo</h4>
                  <p className="text-sm text-gray-600">Clear photo of your face</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <FiVideo className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Video (Optional)</h4>
                  <p className="text-sm text-gray-600">Short video saying your name</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <FiCamera className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Good Lighting</h4>
                  <p className="text-sm text-gray-600">Ensure clear, well-lit photos</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure all text on your NIN card is clearly visible</li>
                  <li>• Take photos in good lighting conditions</li>
                  <li>• Your face should be clearly visible in the selfie</li>
                  <li>• Video is optional but helps with verification</li>
                  <li>• Review will take 24-48 hours</li>
                  <li>• All data is securely encrypted and stored</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="large"
                  onClick={nextStep}
                  className="px-8"
                >
                  Start Verification
                </Button>
              </div>
            </div>
          )}

          {/* Document/Media Capture Steps */}
          {(currentStep === 'nin_front' || currentStep === 'nin_back' || currentStep === 'selfie' || currentStep === 'video') && (
            <div className="space-y-6">
              {/* Camera View */}
              {cameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="text-center mt-4 space-x-4">
                    {currentStep === 'video' ? (
                      <>
                        {!isRecording ? (
                          <Button
                            variant="primary"
                            onClick={startRecording}
                            className="flex items-center space-x-2"
                          >
                            <FiVideo className="w-4 h-4" />
                            <span>Start Recording</span>
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={stopRecording}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                            <span>Stop Recording</span>
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={capturePhoto}
                        className="flex items-center space-x-2"
                      >
                        <FiCamera className="w-4 h-4" />
                        <span>Capture Photo</span>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Capture Options */}
              {!cameraActive && (
                <div className="text-center space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      variant="primary"
                      onClick={startCamera}
                      className="flex items-center justify-center space-x-2 py-3"
                    >
                      <FiCamera className="w-5 h-5" />
                      <span>Use Camera</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center space-x-2 py-3"
                    >
                      <FiUpload className="w-5 h-5" />
                      <span>Upload File</span>
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={currentStep === 'video' ? "video/*" : "image/*"}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Skip Video Option */}
                  {currentStep === 'video' && (
                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        onClick={nextStep}
                        className="text-gray-600"
                      >
                        Skip Video (Optional)
                      </Button>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
                    <h4 className="font-medium text-gray-900 mb-2">Tips for best results:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {currentStep === 'selfie' ? (
                        <>
                          <li>• Look directly at the camera</li>
                          <li>• Ensure your face is well-lit</li>
                          <li>• Remove glasses if possible</li>
                          <li>• Keep a neutral expression</li>
                        </>
                      ) : currentStep === 'video' ? (
                        <>
                          <li>• Say your full name clearly</li>
                          <li>• Keep video under 30 seconds</li>
                          <li>• Ensure good audio quality</li>
                          <li>• Look at the camera while speaking</li>
                        </>
                      ) : (
                        <>
                          <li>• Place card on a flat surface</li>
                          <li>• Ensure all text is readable</li>
                          <li>• Avoid shadows and glare</li>
                          <li>• Fill the frame with the card</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NIN Number Entry */}
          {currentStep === 'nin_number' && (
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National Identification Number (NIN)
                </label>
                <input
                  type="text"
                  value={ninNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      setNinNumber(value);
                    }
                  }}
                  placeholder="Enter your 11-digit NIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-wider"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 11-digit number from your NIN card
                </p>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={ninNumber.length !== 11}
                  className="px-8"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
                Review Your Documents
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* NIN Front */}
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">NIN Front</h4>
                  {documents.nin_front ? (
                    <div className="space-y-3">
                      <img
                        src={documents.nin_front.preview}
                        alt="NIN Front"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => retakeMedia('nin_front')}
                        className="flex items-center space-x-1"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* NIN Back */}
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">NIN Back</h4>
                  {documents.nin_back ? (
                    <div className="space-y-3">
                      <img
                        src={documents.nin_back.preview}
                        alt="NIN Back"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => retakeMedia('nin_back')}
                        className="flex items-center space-x-1"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Selfie */}
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">Selfie</h4>
                  {documents.selfie ? (
                    <div className="space-y-3">
                      <img
                        src={documents.selfie.preview}
                        alt="Selfie"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => retakeMedia('selfie')}
                        className="flex items-center space-x-1"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>

                {/* Video */}
                <div className="text-center">
                  <h4 className="font-medium text-gray-900 mb-3">Video</h4>
                  {documents.video ? (
                    <div className="space-y-3">
                      <video
                        src={documents.video.preview}
                        className="w-full h-32 object-cover rounded-lg border"
                        controls
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => retakeMedia('video')}
                        className="flex items-center space-x-1"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        <span>Retake</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No video</span>
                    </div>
                  )}
                </div>
              </div>

              {/* NIN Number */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">NIN Number:</span>
                  <span className="text-lg tracking-wider">{ninNumber}</span>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={nextStep}
                  disabled={!documents.nin_front || !documents.nin_back || !documents.selfie || !ninNumber}
                  className="px-8"
                >
                  Submit for Review
                </Button>
              </div>
            </div>
          )}

          {/* Submit Step */}
          {currentStep === 'submit' && (
            <div className="text-center space-y-6">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Submit Verification
                </h3>
                <p className="text-gray-600 mb-6">
                  Your documents will be reviewed by our team within 24-48 hours. 
                  You'll receive a notification once the review is complete.
                </p>

                <Button
                  variant="primary"
                  onClick={submitVerification}
                  disabled={loading}
                  className="px-8 py-3"
                >
                  {loading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 mr-2" />
                      Submit Verification
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'instructions' && currentStep !== 'submit' && !success && (
          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={prevStep}
              className="flex items-center space-x-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep !== 'review' && (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={
                  (currentStep === 'nin_front' && !documents.nin_front) ||
                  (currentStep === 'nin_back' && !documents.nin_back) ||
                  (currentStep === 'selfie' && !documents.selfie) ||
                  (currentStep === 'nin_number' && ninNumber.length !== 11)
                }
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <FiArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;