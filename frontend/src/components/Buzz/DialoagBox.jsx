const DialogBox = ({ title, items, highlightFirstThree = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-64 h-48 flex flex-col border border-gray-300">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <div className="overflow-y-auto flex-grow">
        {items.length === 0 ? (
          <p className="text-gray-500 italic">No users yet</p>
        ) : (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li 
                key={index} 
                className={`px-2 py-1 rounded transition-all duration-200 ${
                  highlightFirstThree && index < 3?'font-bold text-lg bg-yellow-100 animate-pulse':'text-gray-700 hover:bg-gray-100'}`}
              >
                {highlightFirstThree && index < 3 ? `${index + 1}. ${item.name}` : item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-sm text-gray-500 mt-1">{items.length} total</div>
    </div>
  );
};

export default DialogBox;