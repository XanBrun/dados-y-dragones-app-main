import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft, AlertTriangle } from "lucide-react";
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { QRCombatData } from '@/types/game';

interface QRScannerProps {
  onScanSuccess: (data: QRCombatData) => void;
  onBack: () => void;
}

const QRScanner = ({ onScanSuccess, onBack }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);

  const checkCameraPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      if (cameras.length === 0) {
        setError('No se detectaron cámaras en el dispositivo.');
        setPermissionGranted(false);
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' }
        } 
      });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      return true;
    } catch (err) {
      console.error('Error de permisos de cámara:', err);
      setPermissionGranted(false);
      setError('Se requieren permisos de cámara para escanear códigos QR. Por favor, permite el acceso a la cámara.');
      return false;
    }
  };

  const startScanning = async () => {
    setError('');
    
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) return;

    setIsScanning(true);

    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader();
      }

      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      let selectedDeviceId = videoInputDevices[0].deviceId;

      // Intentar usar la cámara trasera en dispositivos móviles
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('trasera')
      );
      if (backCamera) {
        selectedDeviceId = backCamera.deviceId;
      }

      if (videoRef.current) {
        controlsRef.current = await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error, controls) => {
            if (result) {
              try {
                const data = JSON.parse(result.getText());
                if (data.type === 'combat' && data.encounter) {
                  onScanSuccess(data);
                  controls.stop();
                  setIsScanning(false);
                } else {
                  setError('QR no válido para combate. Asegúrate de escanear un código QR generado por el narrador.');
                }
              } catch (err) {
                console.error('Error parsing QR data:', err);
                setError('Error al leer el código QR. El formato no es válido.');
              }
            }
            if (error && error.message !== 'NotFound') {
              console.error('Error scanning:', error);
            }
          }
        );
      }
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Error al iniciar el escáner. Verifica que tu dispositivo tenga cámara disponible.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
    setError('');
  };

  const requestPermissions = async () => {
    setError('');
    await checkCameraPermission();
  };

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  return (
    <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-1 h-auto"
          >
            <ArrowLeft size={20} />
          </Button>
          Escanear QR de Combate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissionGranted === false && (
            <div className="text-center p-4 bg-amber-100 border border-amber-300 rounded-lg">
              <AlertTriangle size={48} className="mx-auto text-amber-600 mb-3" />
              <h3 className="text-lg font-bold text-amber-800 mb-2">
                Permisos de Cámara Requeridos
              </h3>
              <p className="text-amber-700 mb-4">
                Para escanear códigos QR necesitamos acceso a tu cámara. 
                Por favor, permite el acceso cuando tu navegador lo solicite.
              </p>
              <Button 
                onClick={requestPermissions}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Camera size={20} className="mr-2" />
                Solicitar Permisos
              </Button>
            </div>
          )}

          {!isScanning && permissionGranted && (
            <div className="text-center py-8">
              <Camera size={64} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-red-600 mb-2">
                ¡Preparado para el Combate!
              </h3>
              <p className="text-red-500 mb-6">
                Escanea el código QR del narrador para comenzar la batalla.
              </p>
              <Button 
                onClick={startScanning}
                className="bg-red-600 hover:bg-red-700"
              >
                <Camera size={20} className="mr-2" />
                Activar Escáner
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-red-600 mb-4">
                  Apunta la cámara hacia el código QR del narrador
                </p>
              </div>
              <div className="relative aspect-video max-w-lg mx-auto">
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="text-center">
                <Button 
                  onClick={stopScanning}
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                >
                  Cancelar Escaneo
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center p-4 bg-red-100 border border-red-300 rounded-lg">
              <AlertTriangle size={24} className="mx-auto text-red-600 mb-2" />
              <p className="text-red-700 mb-3">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => setError('')}
                  variant="outline"
                  size="sm"
                >
                  Cerrar
                </Button>
                {permissionGranted === false && (
                  <Button 
                    onClick={requestPermissions}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reintentar Permisos
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;