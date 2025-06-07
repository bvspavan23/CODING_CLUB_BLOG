import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./MenuBar";

const Card = ({question,options,points,correctAnswers,onQuestionChange,onOptionChange,onCorrectAnswerToggle,onPointsChange,onDelete}) => {
  const questionEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: question,
    onUpdate: ({ editor }) => {
      onQuestionChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose focus:outline-none max-w-full",
      },
    },
  });

  const optionEditors = options.map((option, index) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: option,
      onUpdate: ({ editor }) => {
        onOptionChange(index, editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: "prose focus:outline-none max-w-full",
        },
      },
    });

    return editor;
  });

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-4xl mx-auto transition-all hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Question Card</h3>
          <div className="flex items-center">
            <span className="text-white mr-2 font-medium">Points:</span>
            <input
              type="number"
              value={points}
              onChange={onPointsChange}
              min="1"
              className="w-16 px-3 py-1 bg-blue-500 bg-opacity-30 text-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-center"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              Question:
            </label>
            {questionEditor && (
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <MenuBar editor={questionEditor} />
                <div className="p-4 min-h-[150px] bg-gray-50 whitespace-pre-wrap">
                  <EditorContent editor={questionEditor} />
                </div>
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-4 text-lg">
              Options:
            </label>
            
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:border-blue-400 transition-colors">
                  <div className="flex items-center mb-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={correctAnswers.includes(index)}
                          onChange={() => onCorrectAnswerToggle(index)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                      <span className="ml-3 text-gray-700 font-medium">
                        Correct Answer
                      </span>
                    </label>
                  </div>
                  {optionEditors[index] && (
                    <div className="border border-gray-300 rounded-lg overflow-hidden ml-8 bg-white">
                      <MenuBar editor={optionEditors[index]} compact />
                      <div className="p-3 min-h-[80px]">
                        <EditorContent editor={optionEditors[index]} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onDelete}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;