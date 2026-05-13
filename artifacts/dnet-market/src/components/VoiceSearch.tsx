import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function VoiceSearch({ onSearch, className, placeholder = "Search DNET..." }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-NG";

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setQuery(transcript);
        if (event.results[current].isFinal) {
          setIsListening(false);
          onSearch(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [onSearch]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setQuery("");
      recognitionRef.current?.start();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : placeholder}
        className={cn(
          "w-full pr-12 bg-white/5 dark:bg-black/40 border-white/10",
          "focus-visible:ring-primary focus-visible:border-primary/50",
          "rounded-full h-12 text-base",
          isListening && "border-primary/40 bg-primary/5"
        )}
      />

      {/* Waveform animation when listening */}
      {isListening && (
        <div className="absolute right-12 flex items-center gap-[3px] h-6">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className="w-[3px] rounded-full bg-primary"
              style={{
                animation: `voice-bar 0.9s ease-in-out infinite`,
                animationDelay: `${(bar - 1) * 0.12}s`,
                height: `${8 + Math.random() * 10}px`,
              }}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={cn(
          "absolute right-1 rounded-full h-10 w-10 transition-all duration-300 flex-shrink-0",
          isListening
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(212,175,55,0.55)]"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 opacity-70" />}
      </Button>

      <style>{`
        @keyframes voice-bar {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
