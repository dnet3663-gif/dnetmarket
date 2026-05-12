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
      recognition.lang = "en-NG"; // Optimize for Nigerian English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setQuery(transcript);
        
        if (event.results[current].isFinal) {
          setIsListening(false);
          onSearch(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
          "w-full pr-12 bg-white/5 dark:bg-black/50 border-white/10 dark:border-white/10 backdrop-blur-md",
          "focus-visible:ring-primary focus-visible:border-primary",
          "rounded-full h-12 text-base shadow-inner"
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        className={cn(
          "absolute right-1 rounded-full h-10 w-10 transition-all duration-300",
          isListening 
            ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)]" 
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        )}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 opacity-50" />}
      </Button>
    </div>
  );
}
