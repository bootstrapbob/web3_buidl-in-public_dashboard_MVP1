'use client';

import { useState, useRef, useEffect } from 'react';
import { Image, Search, Plus, Download, Save, Trash2 } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { MemeText } from '@/src/lib/types';
import { generateId } from '@/src/lib/utils';

interface MemeCreatorCardProps {
  onMemeSave: (dataUrl: string) => void;
}

const initialMemeTemplates = [
  { id: '1', url: 'https://picsum.photos/400/400?random=1', title: 'Classic Square', 'data-ai-hint': 'drake-pointing-meme-template' },
  { id: '2', url: 'https://picsum.photos/500/300?random=2', title: 'Wide Format', 'data-ai-hint': 'distracted-boyfriend-meme-template' },
  { id: '3', url: 'https://picsum.photos/400/600?random=3', title: 'Portrait', 'data-ai-hint': 'woman-yelling-at-cat-meme-template' },
  { id: '4', url: 'https://picsum.photos/600/400?random=4', title: 'Landscape', 'data-ai-hint': 'expanding-brain-meme-template' },
  { id: '5', url: 'https://picsum.photos/300/300?random=5', title: 'Compact', 'data-ai-hint': 'doge-meme-template' },
  { id: '6', url: 'https://picsum.photos/450/450?random=6', title: 'Medium Square', 'data-ai-hint': 'this-is-fine-meme-template' },
];

const commonMemeTexts = [
  'HODL Strong! 💎🙌',
  'WAGMI! 🚀',
  'When in doubt, zoom out 📈',
  'Diamond hands only 💎',
  'To the moon! 🌙',
  'BUIDL not FUDL 🔨',
  'Wen Lambo? 🏎️',
  'Not your keys, not your crypto 🔑',
];

const fontFamilies = [
  'Impact',
  'Arial',
  'Helvetica',
  'Comic Sans MS',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana'
];

// Define a maximum dimension for images to prevent large image issues
const MAX_IMAGE_DIMENSION = 400; // Reduced from 1000 to 800 for better performance
const CANVAS_MAX_WIDTH = 600; // Maximum canvas width for display

export function MemeCreatorCard({ onMemeSave }: MemeCreatorCardProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [texts, setTexts] = useState<MemeText[]>([]);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Filter templates based on search
  const filteredTemplates = initialMemeTemplates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to resize image while maintaining aspect ratio
  const resizeImage = (img: HTMLImageElement, maxWidth: number, maxHeight: number): { dataUrl: string, width: number, height: number } => {
    let width = img.width;
    let height = img.height;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > height) {
      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
    }
    return {
      dataUrl: tempCanvas.toDataURL('image/png'),
      width: Math.round(width),
      height: Math.round(height)
    };
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const resized = resizeImage(img, MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
        setBackgroundImage(resized.dataUrl);
        setCanvasSize({ width: resized.width, height: resized.height });
        toast.success('Image uploaded and optimized successfully!');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Load template image
  const loadTemplateImage = (templateUrl: string) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous'; // Required for drawing images from other origins to canvas
    img.onload = () => {
      const resized = resizeImage(img, MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
      setBackgroundImage(resized.dataUrl);
      setCanvasSize({ width: resized.width, height: resized.height });
      toast.success('Template loaded and optimized!');
    };
    img.onerror = () => {
      toast.error('Failed to load template image. Please try another template.');
    };
    img.src = templateUrl;
  };

  // Add new text element
  const addText = (initialText: string = 'NEW TEXT') => {
    const newText: MemeText = {
      id: generateId(),
      text: initialText,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      fontSize: Math.max(24, Math.min(48, canvasSize.width / 12)), // Responsive font size
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontFamily: 'Impact',
      isDragging: false,
      offsetX: 0,
      offsetY: 0
    };
    setTexts(prev => [...prev, newText]);
  };

  // Remove text element
  const removeText = (id: string) => {
    setTexts(prev => prev.filter(text => text.id !== id));
  };

  // Update text property
  const updateTextProperty = (id: string, property: keyof MemeText, value: any) => {
    setTexts(prev => prev.map(text => 
      text.id === id ? { ...text, [property]: value } : text
    ));
  };

  // Get relative position from mouse/touch event
  const getRelativeEventPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Handle interaction start (mouse/touch)
  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    const pos = getRelativeEventPosition(event);
    
    // Find text element under cursor/touch (check in reverse order for top-most)
    for (let i = texts.length - 1; i >= 0; i--) {
      const text = texts[i];
      const canvas = canvasRef.current;
      if (!canvas) continue;

      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      const metrics = ctx.measureText(text.text);
      const textWidth = metrics.width;
      const textHeight = text.fontSize;

      // Check if click/touch is within text bounds
      if (pos.x >= text.x - textWidth/2 && pos.x <= text.x + textWidth/2 &&
          pos.y >= text.y - textHeight/2 && pos.y <= text.y + textHeight/2) {
        
        updateTextProperty(text.id, 'isDragging', true);
        updateTextProperty(text.id, 'offsetX', pos.x - text.x);
        updateTextProperty(text.id, 'offsetY', pos.y - text.y);
        break;
      }
    }
  };

  // Handle interaction move
  const handleInteractionMove = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // Prevent scrolling on touch
    
    const draggingText = texts.find(text => text.isDragging);
    if (!draggingText) return;

    const pos = getRelativeEventPosition(event);
    updateTextProperty(draggingText.id, 'x', pos.x - draggingText.offsetX);
    updateTextProperty(draggingText.id, 'y', pos.y - draggingText.offsetY);
  };

  // Handle interaction end
  const handleInteractionEnd = () => {
    setTexts(prev => prev.map(text => ({ ...text, isDragging: false })));
  };

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Ensure crossOrigin is set for drawing images from other origins
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        
        // Draw texts
        texts.forEach(text => {
          ctx.font = `${text.fontSize}px ${text.fontFamily}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.lineWidth = text.strokeWidth;
          ctx.strokeStyle = text.stroke;
          ctx.fillStyle = text.fill;
          
          // Draw stroke first, then fill
          if (text.strokeWidth > 0) {
            ctx.strokeText(text.text, text.x, text.y);
          }
          ctx.fillText(text.text, text.x, text.y);
        });

        // Update preview
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      };
      img.src = backgroundImage;
    } else {
      // Draw placeholder
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#666';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload an image or select a template', canvas.width / 2, canvas.height / 2);
      setPreviewDataUrl('');
    }
  }, [backgroundImage, texts, canvasSize]);

  const handleSaveMeme = () => {
    if (!previewDataUrl) {
      toast.error('Please add a background image first');
      return;
    }
    onMemeSave(previewDataUrl);
    toast.success('Meme saved for social media post!');
  };

  const handleDownloadMeme = () => {
    if (!previewDataUrl) {
      toast.error('Please add a background image first');
      return;
    }
    
    const link = document.createElement('a');
    link.href = previewDataUrl;
    link.download = 'web3-meme.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Meme downloaded!');
  };

  // Calculate display dimensions for the preview
  const getDisplayDimensions = () => {
    const maxDisplayWidth = CANVAS_MAX_WIDTH;
    const aspectRatio = canvasSize.height / canvasSize.width;
    
    if (canvasSize.width <= maxDisplayWidth) {
      return { width: canvasSize.width, height: canvasSize.height };
    }
    
    return {
      width: maxDisplayWidth,
      height: maxDisplayWidth * aspectRatio
    };
  };

  const displayDimensions = getDisplayDimensions();

  return (
    <SectionCard
      title="Meme Creator"
      description="Create custom memes for your social media posts"
      icon={<Image className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Background Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
            />
          </div>

          {/* Template Search */}
          <div className="space-y-2">
            <Label htmlFor="template-search">Search Templates</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="template-search"
                className="pl-9"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Template List */}
          <div className="space-y-2">
            <Label>Templates</Label>
            <ScrollArea className="h-40 border rounded p-2">
              <div className="flex flex-wrap gap-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplateImage(template.url)}
                    className="relative aspect-square border rounded overflow-hidden hover:border-primary transition-colors group"
                  >
                    <img
                      src={template.url}
                      alt={template.title}
                      data-ai-hint={template['data-ai-hint']}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                      {template.title}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Add Text */}
          <div className="space-y-2">
            <Label>Add Text</Label>
            <Button onClick={() => addText()} size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Text
            </Button>
          </div>

          {/* Text Suggestions */}
          <div className="space-y-2">
            <Label>Quick Text</Label>
            <div className="grid grid-cols-1 gap-1">
              {commonMemeTexts.slice(0, 4).map((text, index) => (
                <Button
                  key={index}
                  onClick={() => addText(text)}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 justify-start"
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Elements Editor */}
          {texts.length > 0 && (
            <div className="space-y-2">
              <Label>Text Elements</Label>
              <Accordion type="single" collapsible>
                {texts.map((text, index) => (
                  <AccordionItem key={text.id} value={text.id}>
                    <AccordionTrigger className="text-sm">
                      Text #{index + 1}: '{text.text.slice(0, 15)}{text.text.length > 15 ? '...' : ''}'
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={text.text}
                          onChange={(e) => updateTextProperty(text.id, 'text', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Font Size: {text.fontSize}px</Label>
                        <Slider
                          value={[text.fontSize]}
                          onValueChange={(value) => updateTextProperty(text.id, 'fontSize', value[0])}
                          min={12}
                          max={Math.min(72, canvasSize.width / 4)}
                          step={1}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={text.fontFamily}
                          onValueChange={(value) => updateTextProperty(text.id, 'fontFamily', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map((font) => (
                              <SelectItem key={font} value={font}>{font}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={text.fill}
                            onChange={(e) => updateTextProperty(text.id, 'fill', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Outline Color</Label>
                          <Input
                            type="color"
                            value={text.stroke}
                            onChange={(e) => updateTextProperty(text.id, 'stroke', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Outline Width: {text.strokeWidth}px</Label>
                        <Slider
                          value={[text.strokeWidth]}
                          onValueChange={(value) => updateTextProperty(text.id, 'strokeWidth', value[0])}
                          min={0}
                          max={8}
                          step={1}
                        />
                      </div>
                      
                      <Button
                        onClick={() => removeText(text.id)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Text
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* Preview Column */}
        <div className="space-y-4">
          <Label>Meme Preview</Label>
          <div
            ref={editorRef}
            className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-muted/50 meme-canvas mx-auto"
            style={{
              width: `${displayDimensions.width}px`,
              height: `${displayDimensions.height}px`,
              maxWidth: '100%'
            }}
            onMouseDown={handleInteractionStart}
            onMouseMove={handleInteractionMove}
            onMouseUp={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchMove={handleInteractionMove}
            onTouchEnd={handleInteractionEnd}
            onTouchCancel={handleInteractionEnd}
          >
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Meme preview"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Upload image or select template</p>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Info */}
          {backgroundImage && (
            <div className="text-xs text-muted-foreground text-center">
              Canvas: {canvasSize.width} × {canvasSize.height}px
            </div>
          )}

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleSaveMeme}
              className="w-full"
              disabled={!backgroundImage}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Meme for Post
            </Button>

            <Button
              onClick={handleDownloadMeme}
              variant="outline"
              className="w-full"
              disabled={!backgroundImage}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Meme
            </Button>
          </div>

          {texts.length > 0 && (
            <p className="text-xs text-muted-foreground">
              💡 Drag text elements on the preview to reposition them
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
