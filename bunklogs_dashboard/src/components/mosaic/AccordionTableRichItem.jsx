import React, { useState } from 'react';

function AccordionTableRichItem(props) {

    // Score background color mapping
  const getScoreBackgroundColor = (score) => {
    if (!score) return "bg-gray-100";
    
    const scoreNum = parseInt(score);
    if (scoreNum == 1) return 'bg-[#e86946]';
    if (scoreNum == 2) return 'bg-[#de8d6f]';
    if (scoreNum == 3) return 'bg-[#e5e825]';
    if (scoreNum == 4) return 'bg-[#90d258]';
    if (scoreNum == 5) return 'bg-[#18d128]';
    return "bg-red-100";
  };

  const [open, setOpen] = useState(false);

  return (
    <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center text-gray-800">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mr-2 sm:mr-3">
              <img className="rounded-full ml-1" src={props.image} width="40" height="40" alt={props.customer} />
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-100">{props.camper_first_name} {props.camper_last_name}</div>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center">{props.date}</div>
        </td>
        <td className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${getScoreBackgroundColor(props.social_score)}`}>
          <div className="text-center">{props.social_score}</div>
        </td>
        <td className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${getScoreBackgroundColor(props.behavior_score)}`}>
          <div className="text-center">{props.behavior_score}</div>
        </td>
        <td className={`px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap ${getScoreBackgroundColor(props.participation_score)}`}>
          <div className="text-center">{props.participation_score}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center">{props.camper_care_help}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-center">{props.unit_head_help}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="flex items-center">
            <button
              className={`text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 ${open && 'rotate-180'}`}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              aria-controls={`description-${props.id}`}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      {/*
      Example of content revealing when clicking the button on the right side:
      Note that you must set a "colSpan" attribute on the <td> element,
      and it should match the number of columns in your table
      */}
      <tr id={`description-${props.id}`} role="region" className={`${!open && 'hidden'}`}>
        <td colSpan="10" className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="bg-gray-50 dark:bg-gray-950/[0.15] dark:text-gray-400 p-3 -mt-3">
            <div className="text-sm mb-3">
              <div className="font-medium text-gray-800 dark:text-gray-100 mb-1">{props.counselor_name}</div>
              <div>{props.descriptionBody}</div>
            </div>
            <button className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">Approve</button>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default AccordionTableRichItem;
