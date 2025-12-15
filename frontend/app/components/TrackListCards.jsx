import React from 'react'

const List = ({ items, selectedIds, onSelect, toggleAll }) => {
  return (

    <div className='flex flex-col gap-5 justify-center items-center w-full p-3'>
      <button className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
        onClick={toggleAll}
      >
        select all
      </button>
      <div className='flex flex-row flex-wrap gap-5'>
        {items.map((item) => (
          <label key={item.id}
            className="relative flex flex-col items-center text-center box-border border p-5
                          bg-neutral-900 hover:text-teal-500  has-checked:text-teal-500
                          cursor-pointer rounded-sm transition ease-in duration-200 select-none"
          >
            <div>
              <img src={item.cover_medium} alt={item.title} className='h-36 w-36' />
            </div>

            <p className='text-wrap w-28 pb-4'>{item.title}</p>
            <input
              type='checkbox'
              className='absolute bottom-3 right-5 cursor-pointer appearance-none rounded-full w-6 h-6 border checked:bg-green-500'
              id={`checkbox-${item.id}`}

              checked={selectedIds.includes(item.id)}
              onChange={() => onSelect(item.id)}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 text-white">
        Selected IDs: {JSON.stringify(selectedIds)}
      </div>
    </div>
  )
}

export default List;