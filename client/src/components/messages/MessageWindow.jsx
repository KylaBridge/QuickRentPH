import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  IoChevronBack,
  IoHappyOutline,
  IoAttachOutline,
  IoSend,
} from "react-icons/io5";

const MessageWindow = ({ id, message, onBack }) => {
  // Use the passed message data instead of static conversations
  const messages = message
    ? [{ sender: "user", text: message.content }]
    : [{ sender: "system", text: "No conversation found." }];

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (input.trim() === "") return;
    // For demo, just clear input. You can add send logic here.
    setInput("");
  };

  const onEmojiClick = (emojiData, event) => {
    setInput(input + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 bg-white shadow flex items-center justify-between border-b-0 border-l-0 border-r-0">
        <div
          onClick={onBack}
          className="text-[#6C4BF4] cursor-pointer select-none flex items-center"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onBack();
          }}
        >
          <IoChevronBack className="w-4 h-4 inline mr-1" />
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
              msg.sender === "user"
                ? "bg-[#6C4BF4] text-white self-end ml-auto"
                : "bg-gray-300 text-gray-900 self-start"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Toggle emoji picker"
          >
            <IoHappyOutline className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 shadow-lg z-10">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={320}
                height={400}
                previewConfig={{
                  showPreview: false,
                }}
                skinTonesDisabled={true}
                searchDisabled={false}
              />
            </div>
          )}
        </div>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Attach image"
        >
          <IoAttachOutline className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          className="p-2 text-[#6C4BF4] hover:text-[#5a3fb3] transform rotate-90 cursor-pointer"
          aria-label="Send message"
        >
          <IoSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageWindow;
