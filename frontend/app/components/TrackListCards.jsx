import React from 'react'

const List = ({ items, selectedIds, onSelect, toggleAll, singles, setSelectedAlbumIds }) => {
  const singlesIds = singles ? singles.map(s => s.id) : [];
  const isAllSinglesSelected = singlesIds.length > 0 && singlesIds.every(id => selectedIds.includes(id));

  const handleSinglesToggle = () => {
    if (isAllSinglesSelected) {
      const newSelection = selectedIds.filter(id => !singlesIds.includes(id))
      setSelectedAlbumIds(newSelection);
    } else {
      const newSelection = [...new Set([...selectedIds, ...singlesIds])];
      setSelectedAlbumIds(newSelection)
    }
  }
  return (

    <div className='flex flex-col gap-5 justify-center items-center w-full p-3'>
      <button className='cursor-pointer border rounded-sm bg-neutral-800 p-3 hover:text-teal-500 transition ease-in-out duration 150'
        onClick={toggleAll}
      >
        select all
      </button>
      <div className='flex flex-row flex-wrap gap-5 justify-center'>
        {items.map((item) => (
          <label key={item.id}
            onMouseDown={(e) => e.preventDefault()}
            className="relative flex flex-col items-center text-center box-border border p-5
                          bg-neutral-900 hover:text-teal-500  has-checked:text-teal-500
                          cursor-pointer rounded-sm transition ease-in duration-200 select-none"
          >
            <div>
              <img src={item.cover_medium} alt={item.title} className='h-36 w-36'
                draggable={false}
              />
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

        {singles && singles.length > 0 && (
          <label className="relative flex flex-col items-center text-center box-border border p-5
                            bg-neutral-900 hover:text-teal-500 has-checked:text-teal-500
                            cursor-pointer rounded-sm transition ease-in duration-200 select-none"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div>
              <img
                src={singles[0]?.cover_medium}
                alt="Singles Collection"
                className='h-36 w-36 object-cover opacity-80'
                draggable={false}
              />
            </div>
            <p className='text-wrap w-28 pb-4'>Singles</p>
            <input
              type='checkbox'
              className='absolute bottom-3 right-5 cursor-pointer appearance-none rounded-full w-6 h-6 border checked:bg-green-500'
              id="checkbox-singles-collection"
              checked={isAllSinglesSelected}
              onChange={handleSinglesToggle}
            />
          </label>
        )}

      </div>
      <div className="mt-5 text-white">
        Selected IDs: {JSON.stringify(selectedIds)}
      </div>
    </div>
  )
}

export default List;