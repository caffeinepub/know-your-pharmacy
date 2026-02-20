import { useState } from 'react';
import { useCamera } from '../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, SwitchCamera, X, Loader2 } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  facingMode?: 'user' | 'environment';
}

export default function CameraCapture({ onCapture, facingMode = 'environment' }: CameraCaptureProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode, quality: 0.8 });

  const handleOpen = async () => {
    setOpen(true);
    await startCamera();
  };

  const handleClose = async () => {
    await stopCamera();
    setOpen(false);
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      onCapture(file);
      await handleClose();
    }
  };

  if (isSupported === false) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('camera.notSupported')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outline" type="button">
        <Camera className="mr-2 h-4 w-4" />
        {t('camera.takePhoto')}
      </Button>

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('camera.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error.type === 'permission' && t('camera.permissionDenied')}
                  {error.type === 'not-found' && t('camera.notFound')}
                  {error.type === 'not-supported' && t('camera.notSupported')}
                  {error.type === 'unknown' && error.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button variant="outline" onClick={handleClose} type="button">
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <div className="flex gap-2">
              {typeof window !== 'undefined' && !window.navigator.userAgent.includes('Windows') && (
                <Button
                  variant="outline"
                  onClick={() => switchCamera()}
                  disabled={!isActive || isLoading}
                  type="button"
                >
                  <SwitchCamera className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={handleCapture}
                disabled={!isActive || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700"
                type="button"
              >
                <Camera className="mr-2 h-4 w-4" />
                {t('camera.capture')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
