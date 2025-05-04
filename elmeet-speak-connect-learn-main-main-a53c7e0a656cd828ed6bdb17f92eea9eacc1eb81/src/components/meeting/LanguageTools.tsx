import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Languages, 
  Globe, 
  Keyboard, 
  BookOpen, 
  MessageCircle, 
  Copy, 
  Check, 
  Search, 
  Volume2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Types
interface CharacterKey {
  character: string;
  label?: string;
  width?: number; // in units, 1 = standard key width
  type?: "character" | "modifier" | "special";
}

interface KeyboardLayout {
  id: string;
  name: string;
  language: string;
  rows: CharacterKey[][];
}

interface Definition {
  definition: string;
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryResult {
  word: string;
  phonetic: string;
  meanings: Meaning[];
}

interface LanguageToolsProps {
  meetingId: string;
}

const LanguageTools: React.FC<LanguageToolsProps> = ({ meetingId }) => {
  const [activeTab, setActiveTab] = useState<"keyboard" | "dictionary" | "phrases">("keyboard");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("korean");
  const [inputText, setInputText] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DictionaryResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null);
  
  // Keyboard layouts
  const keyboardLayouts: { [key: string]: KeyboardLayout } = {
    korean: {
      id: "korean",
      name: "Korean (Hangul)",
      language: "Korean",
      rows: [
        [
          { character: "ㅂ", label: "b" },
          { character: "ㅈ", label: "j" },
          { character: "ㄷ", label: "d" },
          { character: "ㄱ", label: "g" },
          { character: "ㅅ", label: "s" },
          { character: "ㅛ", label: "yo" },
          { character: "ㅕ", label: "yeo" },
          { character: "ㅑ", label: "ya" },
          { character: "ㅐ", label: "ae" },
          { character: "ㅔ", label: "e" }
        ],
        [
          { character: "ㅁ", label: "m" },
          { character: "ㄴ", label: "n" },
          { character: "ㅇ", label: "ng" },
          { character: "ㄹ", label: "r/l" },
          { character: "ㅎ", label: "h" },
          { character: "ㅗ", label: "o" },
          { character: "ㅓ", label: "eo" },
          { character: "ㅏ", label: "a" },
          { character: "ㅣ", label: "i" }
        ],
        [
          { character: "ㅋ", label: "k" },
          { character: "ㅌ", label: "t" },
          { character: "ㅊ", label: "ch" },
          { character: "ㅍ", label: "p" },
          { character: "ㅠ", label: "yu" },
          { character: "ㅜ", label: "u" },
          { character: "ㅡ", label: "eu" },
          { character: " ", label: "Space", width: 2, type: "special" }
        ]
      ]
    },
    japanese: {
      id: "japanese",
      name: "Japanese (Hiragana)",
      language: "Japanese",
      rows: [
        [
          { character: "あ", label: "a" },
          { character: "い", label: "i" },
          { character: "う", label: "u" },
          { character: "え", label: "e" },
          { character: "お", label: "o" }
        ],
        [
          { character: "か", label: "ka" },
          { character: "き", label: "ki" },
          { character: "く", label: "ku" },
          { character: "け", label: "ke" },
          { character: "こ", label: "ko" }
        ],
        [
          { character: "さ", label: "sa" },
          { character: "し", label: "shi" },
          { character: "す", label: "su" },
          { character: "せ", label: "se" },
          { character: "そ", label: "so" }
        ],
        [
          { character: "た", label: "ta" },
          { character: "ち", label: "chi" },
          { character: "つ", label: "tsu" },
          { character: "て", label: "te" },
          { character: "と", label: "to" }
        ],
        [
          { character: "な", label: "na" },
          { character: "に", label: "ni" },
          { character: "ぬ", label: "nu" },
          { character: "ね", label: "ne" },
          { character: "の", label: "no" }
        ],
        [
          { character: " ", label: "Space", width: 2, type: "special" }
        ]
      ]
    },
    chinese: {
      id: "chinese",
      name: "Chinese (Pinyin)",
      language: "Chinese",
      rows: [
        [
          { character: "ā", label: "a1" },
          { character: "á", label: "a2" },
          { character: "ǎ", label: "a3" },
          { character: "à", label: "a4" },
          { character: "ē", label: "e1" },
          { character: "é", label: "e2" },
          { character: "ě", label: "e3" },
          { character: "è", label: "e4" }
        ],
        [
          { character: "ī", label: "i1" },
          { character: "í", label: "i2" },
          { character: "ǐ", label: "i3" },
          { character: "ì", label: "i4" },
          { character: "ō", label: "o1" },
          { character: "ó", label: "o2" },
          { character: "ǒ", label: "o3" },
          { character: "ò", label: "o4" }
        ],
        [
          { character: "ū", label: "u1" },
          { character: "ú", label: "u2" },
          { character: "ǔ", label: "u3" },
          { character: "ù", label: "u4" },
          { character: "ǖ", label: "ü1" },
          { character: "ǘ", label: "ü2" },
          { character: "ǚ", label: "ü3" },
          { character: "ǜ", label: "ü4" }
        ],
        [
          { character: " ", label: "Space", width: 2, type: "special" }
        ]
      ]
    }
  };
  
  // Common phrases by language
  const commonPhrases: { [key: string]: { id: string; phrase: string; translation: string; category: string }[] } = {
    korean: [
      { id: "kr1", phrase: "안녕하세요", translation: "Hello", category: "Greetings" },
      { id: "kr2", phrase: "감사합니다", translation: "Thank you", category: "Greetings" },
      { id: "kr3", phrase: "죄송합니다", translation: "I'm sorry", category: "Greetings" },
      { id: "kr4", phrase: "이름이 뭐예요?", translation: "What is your name?", category: "Questions" },
      { id: "kr5", phrase: "저는 [이름]입니다", translation: "My name is [name]", category: "Introductions" },
      { id: "kr6", phrase: "어디에서 왔어요?", translation: "Where are you from?", category: "Questions" },
      { id: "kr7", phrase: "천천히 말해 주세요", translation: "Please speak slowly", category: "Learning" },
      { id: "kr8", phrase: "다시 말해 주세요", translation: "Please say that again", category: "Learning" }
    ],
    japanese: [
      { id: "jp1", phrase: "こんにちは", translation: "Hello", category: "Greetings" },
      { id: "jp2", phrase: "ありがとうございます", translation: "Thank you", category: "Greetings" },
      { id: "jp3", phrase: "すみません", translation: "Excuse me/I'm sorry", category: "Greetings" },
      { id: "jp4", phrase: "お名前は何ですか？", translation: "What is your name?", category: "Questions" },
      { id: "jp5", phrase: "私の名前は[名前]です", translation: "My name is [name]", category: "Introductions" },
      { id: "jp6", phrase: "出身はどこですか？", translation: "Where are you from?", category: "Questions" },
      { id: "jp7", phrase: "ゆっくり話してください", translation: "Please speak slowly", category: "Learning" },
      { id: "jp8", phrase: "もう一度言ってください", translation: "Please say that again", category: "Learning" }
    ],
    chinese: [
      { id: "cn1", phrase: "你好", translation: "Hello", category: "Greetings" },
      { id: "cn2", phrase: "谢谢", translation: "Thank you", category: "Greetings" },
      { id: "cn3", phrase: "对不起", translation: "I'm sorry", category: "Greetings" },
      { id: "cn4", phrase: "你叫什么名字？", translation: "What is your name?", category: "Questions" },
      { id: "cn5", phrase: "我叫[名字]", translation: "My name is [name]", category: "Introductions" },
      { id: "cn6", phrase: "你从哪里来？", translation: "Where are you from?", category: "Questions" },
      { id: "cn7", phrase: "请说慢一点", translation: "Please speak slowly", category: "Learning" },
      { id: "cn8", phrase: "请再说一遍", translation: "Please say that again", category: "Learning" }
    ]
  };
  
  // Handle keyboard key press
  const handleKeyPress = (key: CharacterKey) => {
    setInputText(prev => prev + key.character);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };
  
  // Clear input
  const clearInput = () => {
    setInputText("");
  };
  
  // Copy input to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText);
  };
  
  // Search dictionary
  const searchDictionary = () => {
    if (!searchTerm.trim()) return;
    
    // In a real app, you would call an API to get dictionary results
    // For this example, we'll simulate results
    const mockResults = [
      {
        word: searchTerm,
        phonetic: "/example/",
        meanings: [
          {
            partOfSpeech: "noun",
            definitions: [
              {
                definition: "This is a sample definition for demonstration purposes.",
                example: "This is an example sentence."
              }
            ]
          }
        ]
      }
    ];
    
    setSearchResults(mockResults);
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
    }
  };
  
  // Copy phrase to clipboard
  const copyPhrase = (phraseId: string, phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhraseId(phraseId);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedPhraseId(null);
    }, 2000);
  };
  
  // Text-to-speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selected language
      switch (selectedLanguage) {
        case 'korean':
          utterance.lang = 'ko-KR';
          break;
        case 'japanese':
          utterance.lang = 'ja-JP';
          break;
        case 'chinese':
          utterance.lang = 'zh-CN';
          break;
        default:
          utterance.lang = 'en-US';
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };
  
  return (
    <div className="language-tools h-full flex flex-col">
      <div className="header flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Language Tools</h2>
        
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="korean">Korean</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs 
        defaultValue="keyboard" 
        className="flex-1 flex flex-col"
        onValueChange={(value) => setActiveTab(value as "keyboard" | "dictionary" | "phrases")}
        value={activeTab}
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="keyboard" className="flex-1">
              <Keyboard size={16} className="mr-2" />
              Character Pad
            </TabsTrigger>
            <TabsTrigger value="dictionary" className="flex-1">
              <BookOpen size={16} className="mr-2" />
              Dictionary
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex-1">
              <MessageCircle size={16} className="mr-2" />
              Phrases
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="keyboard" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type or use the character pad below"
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearInput}
                  className="h-8 w-8"
                >
                  <span className="sr-only">Clear</span>
                  ×
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                >
                  <Copy size={14} />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
            </div>
            
            <div className="virtual-keyboard bg-gray-100 p-3 rounded-lg">
              <div className="text-sm font-medium mb-2">
                {keyboardLayouts[selectedLanguage]?.name || "Keyboard"}
              </div>
              <div className="space-y-2">
                {keyboardLayouts[selectedLanguage]?.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key, keyIndex) => (
                      <Button
                        key={`${rowIndex}-${keyIndex}`}
                        variant="outline"
                        className={`h-12 flex flex-col justify-center items-center ${
                          key.width ? `w-${key.width * 12}` : 'w-12'
                        } ${key.type === 'special' ? 'bg-gray-200' : ''}`}
                        onClick={() => handleKeyPress(key)}
                      >
                        <span className="text-lg">{key.character}</span>
                        {key.label && <span className="text-xs text-gray-500">{key.label}</span>}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>
                Use this character pad to type special characters for {keyboardLayouts[selectedLanguage]?.language}.
                Click on a character to add it to the input field above.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dictionary" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${keyboardLayouts[selectedLanguage]?.language || ""} dictionary`}
                  onKeyDown={(e) => e.key === 'Enter' && searchDictionary()}
                />
              </div>
              <Button onClick={searchDictionary}>
                <Search size={16} className="mr-2" />
                Search
              </Button>
            </div>
            
            {recentSearches.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Recent Searches</div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        setSearchTerm(term);
                        searchDictionary();
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="dictionary-results">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              {result.word}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => speakText(result.word)}
                                className="ml-2 h-8 w-8"
                              >
                                <Volume2 size={16} />
                              </Button>
                            </CardTitle>
                            <CardDescription>{result.phonetic}</CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard()}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {result.meanings.map((meaning, mIndex) => (
                          <div key={mIndex} className="mb-3">
                            <div className="font-medium text-sm text-gray-500 mb-1">
                              {meaning.partOfSpeech}
                            </div>
                            {meaning.definitions.map((def, dIndex) => (
                              <div key={dIndex} className="mb-2">
                                <div className="text-sm">{def.definition}</div>
                                {def.example && (
                                  <div className="text-sm text-gray-500 italic mt-1">
                                    "{def.example}"
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500">
                  No results found. Try a different search term.
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Search for a word to see its definition.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="phrases" className="flex-1 p-4 overflow-auto">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {Object.entries(
                commonPhrases[selectedLanguage]?.reduce<Record<string, typeof commonPhrases[keyof typeof commonPhrases]>>(
                  (acc, phrase) => {
                    if (!acc[phrase.category]) {
                      acc[phrase.category] = [];
                    }
                    acc[phrase.category].push(phrase);
                    return acc;
                  },
                  {}
                ) || {}
              ).map(([category, phrases]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium mb-2">{category}</h3>
                  <div className="space-y-2">
                    {phrases.map((phrase) => (
                      <Card key={phrase.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium mb-1 flex items-center">
                                {phrase.phrase}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => speakText(phrase.phrase)}
                                  className="ml-1 h-6 w-6"
                                >
                                  <Volume2 size={14} />
                                </Button>
                              </div>
                              <div className="text-sm text-gray-600">{phrase.translation}</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyPhrase(phrase.id, phrase.phrase)}
                            >
                              {copiedPhraseId === phrase.id ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageTools;