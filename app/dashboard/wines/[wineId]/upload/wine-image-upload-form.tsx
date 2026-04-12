"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

type Props = {
  wineId: number;
};

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function WineImageUploadForm({ wineId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasImage = useMemo(() => Boolean(imageSrc), [imageSrc]);

  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Bitte wähle eine Bilddatei aus.");
      return;
    }

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(selectedFile);
  }

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  async function createCroppedBlob(): Promise<Blob> {
    if (!imageSrc || !croppedAreaPixels) {
      throw new Error("Kein Bildausschnitt vorhanden.");
    }

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas konnte nicht initialisiert werden.");
    }

    const targetWidth = 1200;
    const targetHeight = 1500;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Das Bild konnte nicht verarbeitet werden."));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.82
      );
    });
  }

  async function handleUpload() {
    if (!file || !imageSrc || !croppedAreaPixels) {
      setError("Bitte wähle ein Bild und einen Ausschnitt aus.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const croppedBlob = await createCroppedBlob();
      const uploadFile = new File([croppedBlob], `wine-${wineId}.jpg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("wineId", String(wineId));

      const response = await fetch("/api/wine-images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Upload fehlgeschlagen.");
      }

      router.push(`/wines/${wineId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="comic-card relative overflow-hidden px-6 pb-8 pt-6">
      <div className="mb-6">
        <div className="mb-2 text-sm font-black uppercase tracking-[0.3em] text-red-700">
          Bildauswahl
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Flaschenfoto zuschneiden
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border-2 border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
          >
            Bild auswählen
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />
        </div>

        {hasImage ? (
          <>
            <div className="relative h-[420px] overflow-hidden border-2 border-black bg-neutral-100">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em]">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className={`border-2 border-black px-5 py-3 text-sm font-black uppercase tracking-[0.2em] transition ${
                  loading
                    ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                    : "bg-black text-white hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Wird hochgeladen ..." : "Foto speichern"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setImageSrc(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);
                  setError(null);
                }}
                className="border-2 border-black bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5"
              >
                Zurücksetzen
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm leading-7 text-neutral-700">
            Wähle ein Bild aus deiner Galerie oder nimm direkt mit dem Handy ein
            neues Foto auf. Danach kannst du den passenden Ausschnitt festlegen.
          </p>
        )}

        {error ? (
          <div className="border-2 border-red-700 bg-white px-4 py-3 text-sm font-black text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}