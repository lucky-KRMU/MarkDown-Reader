import React from 'react'

function MainBody() {
  return (
    <>
    <main className='h-[88vh] w-full bg-zinc-800 flex items-center justify-center'>
        <input type="file" name="mdfile" id="mdfile" className='height-[60vh] w-[80vw]  
        text-center text-white cursor-pointer
        border-2 border-zinc-950 border-dashed rounded-2xl py-[30vh]' />
    </main>
    </>
  )
}

export default MainBody