
import { useState } from 'react';

const MessageWindow = ({ id, message, onBack }) => {
  // Use the passed message data instead of static conversations
  const messages = message ? [{ sender: 'user', text: message.content }] : [{ sender: 'system', text: 'No conversation found.' }];

  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (input.trim() === '') return;
    // For demo, just clear input. You can add send logic here.
    setInput('');
  };

  const addEmoji = (emoji) => {
    setInput(input + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '❤️', '👍', '😢', '😮', '🙌', '🔥', '💯', '🎉', '😍', '🤔', '😎', '🥺', '😭', '😜', '🤗', '😏', '🙄', '😴', '🤤', '😇', '🤪', '🥳', '🤩'];

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 bg-white shadow flex items-center justify-between border-b-0 border-l-0 border-r-0">
        <div
          onClick={onBack}
          className="text-[#6C4BF4] cursor-pointer select-none flex items-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onBack(); }}
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </div>
        <h2 className="text-base font-semibold border-b-0 border-l-0 border-r-0 text-[#6C4BF4]">
          {message ? message.username : `Conversation #${id}`}
        </h2>
        <div></div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg ${
              msg.sender === 'user' ? 'bg-[#6C4BF4] text-white self-end ml-auto' : 'bg-gray-300 text-gray-900 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 bg-white flex items-center space-x-2 relative">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Toggle emoji picker"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-10 w-72">
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-gray-100 p-1 rounded cursor-pointer"
                    aria-label={`Add emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Attach image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button
          onClick={handleSend}
          className="p-2 text-[#6C4BF4] hover:text-[#5a3fb3] transform rotate-90 cursor-pointer"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageWindow;