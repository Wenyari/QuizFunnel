"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { cn } from '../../utils/cn';

export default function TestUIPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState(25);
  const [theme, setTheme] = useState('ocean');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleInputSubmit = () => {
    if (inputValue.length < 3) {
      setError("Input must be at least 3 characters");
    } else {
      setError(undefined);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 bg-background flex flex-col gap-10">
      <div className="p-4 rounded-xl bg-gray-100 flex items-center justify-between shadow-sm">
        <span className="font-semibold text-gray-700">Theme:</span>
        <div className="flex gap-2">
          <button 
            className={cn("w-6 h-6 rounded-full bg-blue-600 ring-offset-2", theme === 'ocean' && "ring-2 ring-blue-600")}
            onClick={() => setTheme('ocean')}
            title="Ocean (Default)"
          />
          <button 
            className={cn("w-6 h-6 rounded-full bg-rose-500 ring-offset-2", theme === 'coral' && "ring-2 ring-rose-500")}
            onClick={() => setTheme('coral')}
            title="Coral"
          />
          <button 
            className={cn("w-6 h-6 rounded-full bg-emerald-500 ring-offset-2", theme === 'mint' && "ring-2 ring-emerald-500")}
            onClick={() => setTheme('mint')}
            title="Mint"
          />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">UI Components Test</h1>
        <ProgressBar value={progress} />
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => setProgress(p => Math.max(0, p - 25))}>-25%</Button>
          <Button size="sm" onClick={() => setProgress(p => Math.min(100, p + 25))}>+25%</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-col gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Option Cards</h2>
        <div className="flex flex-col gap-4">
          <Card selected={selectedCard === 1} onClick={() => setSelectedCard(1)}>
            <div className="font-semibold text-lg text-center">Option 1</div>
          </Card>
          <Card selected={selectedCard === 2} onClick={() => setSelectedCard(2)}>
            <div className="font-semibold text-lg text-center">Option 2</div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Input with Error Shake</h2>
        <div className="flex flex-col gap-4">
          <Input 
            label="Test Input" 
            placeholder="Type something..." 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            error={error}
          />
          <Button onClick={handleInputSubmit}>Validate Input</Button>
        </div>
      </div>
    </div>
  );
}
