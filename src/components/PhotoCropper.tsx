import { useEffect, useMemo, useRef, useState } from "react";
import { Move, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const VIEW = 280;

export function PhotoCropper({ source, onCancel, onSave }: {
  source: string;
  onCancel: () => void;
  onSave: (photo: string) => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const baseScale = Math.max(VIEW / size.width, VIEW / size.height);
  const displayed = useMemo(() => ({
    width: size.width * baseScale * zoom,
    height: size.height * baseScale * zoom,
  }), [baseScale, size.height, size.width, zoom]);

  const clamp = (x: number, y: number, current = displayed) => ({
    x: Math.max((VIEW - current.width) / 2, Math.min((current.width - VIEW) / 2, x)),
    y: Math.max((VIEW - current.height) / 2, Math.min((current.height - VIEW) / 2, y)),
  });

  useEffect(() => {
    setPosition((current) => clamp(current.x, current.y));
  // clamp is derived from displayed dimensions and should run when they change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed.width, displayed.height]);

  const save = () => {
    const image = imageRef.current;
    if (!image) return;
    const scale = baseScale * zoom;
    const sourceSize = VIEW / scale;
    const sourceX = (size.width / 2) - (VIEW / 2 + position.x) / scale;
    const sourceY = (size.height / 2) - (VIEW / 2 + position.y) / scale;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 480;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 480, 480);
    onSave(canvas.toDataURL("image/jpeg", 0.82));
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-h-[95dvh] w-[calc(100%-1rem)] overflow-y-auto rounded-lg p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="pr-7 text-left">
          <DialogTitle>Ajustar foto</DialogTitle>
          <DialogDescription>Arraste a foto e ajuste o tamanho até o rosto ficar bem posicionado.</DialogDescription>
        </DialogHeader>
        <div
          className="relative mx-auto touch-none overflow-hidden rounded-full border-4 border-primary bg-muted"
          style={{ width: VIEW, height: VIEW }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = { x: event.clientX, y: event.clientY, ox: position.x, oy: position.y };
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag) return;
            setPosition(clamp(drag.ox + event.clientX - drag.x, drag.oy + event.clientY - drag.y));
          }}
          onPointerUp={() => { dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
          aria-label="Área de recorte da foto"
        >
          <img
            ref={imageRef}
            src={source}
            alt="Foto para ajustar"
            draggable={false}
            onLoad={(event) => setSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
            className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
            style={{ width: size.width * baseScale, height: size.height * baseScale, transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4 text-primary-foreground drop-shadow-md">
            <Move aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <ZoomIn className="size-5 shrink-0" aria-hidden="true" />
            <Slider value={[zoom]} min={1} max={3} step={0.05} onValueChange={(value) => setZoom(value[0] ?? 1)} aria-label="Tamanho da foto" />
          </div>
          <p className="text-center text-sm text-muted-foreground">A foto continua somente neste aparelho.</p>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button type="button" variant="outline" className="min-h-12" onClick={onCancel}>Cancelar</Button>
          <Button type="button" className="min-h-12" onClick={save}>Usar esta foto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}