import React from "react";
import {FaBold,FaItalic,FaUnderline,FaLink,FaListUl,FaListOl,FaAlignLeft,FaAlignCenter,FaAlignRight,FaAlignJustify,FaParagraph,FaHeading,} from "react-icons/fa";

const MenuBar = ({ editor, compact = false }) => {
  if (!editor) return null;

  const basicButtons = [
    {
      icon: <FaBold />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <FaItalic />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <FaUnderline />,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <FaParagraph />,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
    },
    {
      icon: <FaHeading />,
      title: "Heading",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
    },
  ];

  const alignmentButtons = [
    {
      icon: <FaAlignLeft />,
      title: "Align Left",
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <FaAlignCenter />,
      title: "Align Center",
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <FaAlignRight />,
      title: "Align Right",
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <FaAlignJustify />,
      title: "Justify",
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
    },
  ];

  const listButtons = [
    {
      icon: <FaListUl />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <FaListOl />,
      title: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <FaLink />,
      title: "Link",
      action: () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) return;
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
      isActive: editor.isActive("link"),
    },
  ];

  const buttons = compact 
    ? basicButtons 
    : [...basicButtons, ...alignmentButtons, ...listButtons];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 rounded-t border-b border-gray-200">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.action}
          className={`p-2 rounded hover:bg-gray-200 ${
            button.isActive ? "bg-gray-300 text-blue-600" : "text-gray-700"
          }`}
          title={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;