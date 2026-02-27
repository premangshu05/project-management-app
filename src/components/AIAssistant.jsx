import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);

    const suggestions = [
        {
            title: 'Optimize Project Timeline',
            description: 'E-Commerce Platform Redesign can be completed 5 days earlier with resource reallocation.'
        },
        {
            title: 'Risk Alert',
            description: 'Mobile App Development is at risk of delay. Consider adding 1 more developer.'
        },
        {
            title: 'Smart Suggestion',
            description: 'Based on team velocity, recommend breaking down "Backend API Development" into smaller tasks.'
        },
        {
            title: 'Productivity Insight',
            description: 'Team productivity is 23% higher on Tuesdays and Wednesdays. Schedule critical reviews accordingly.'
        }
    ];

    return (
        <>
            {/* Floating Action Button */}
            <button
                className="ai-assistant-fab"
                onClick={() => setIsOpen(!isOpen)}
                title="AI Assistant"
            >
                <Sparkles />
            </button>

            {/* AI Panel */}
            {isOpen && (
                <div className="ai-assistant-panel">
                    <div className="ai-assistant-header">
                        <h3 className="gradient-text">AI Assistant</h3>
                        <button className="ai-assistant-close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="ai-assistant-content custom-scrollbar">
                        <p className="text-sm text-secondary ai-intro-text">
                            Here are some smart suggestions to improve your project management:
                        </p>
                        <div className="ai-assistant-suggestions">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="ai-suggestion-card">
                                    <h4 className="ai-suggestion-title">{suggestion.title}</h4>
                                    <p className="ai-suggestion-desc">{suggestion.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
