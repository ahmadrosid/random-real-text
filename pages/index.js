import { nanoid } from 'nanoid';
import Head from 'next/head'
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { titleCase } from "title-case";

function generateText(source, length) {
  const list = source.split("")
  let filtered = list
    .filter(item => item !== "!" || item !== "," || item !== "=" || item !== "“" || item !== "”" || item !== "[" || item !== "]")
    .filter(item => item !== "\"" || item !== "." || item !== "\\" || item != "’")
    .filter(item => item !== ":" || item !== ";" || item !== "(" || item !== ")")
    .filter(item => item !== '/' || item !== '{' || item !== '}' || item !== '<' || item !== '>')
    .map(item => {
      if (item == "\n") return " ";
      return item;
    })

  let splitted = filtered.join("").split(" ");
  let keys = {};
  splitted = splitted.filter(item => {
    if (item === " ") return false;
    if (keys[item]) return false;
    keys[item] = item;
    return true
  })

  let res = []
  const total = splitted.length;
  while (--length) {
    let next_r = Math.floor(Math.random() * total)
    let txt = splitted[next_r];
    res.push(txt)
  }

  return titleCase(res.join(" "))
}

export default function Home() {
  const [vals, setValues] = useState([]);
  const [textLength, setTextLength] = useState(12);
  const [totalText, setTotalText] = useState(1);
  const ref = useRef();

  function submitGenerate() {
    const results = Array(totalText).fill(0).map(() => generateText(ref?.current.value, textLength))
    setValues(results)
  }

  return (
    <>
      <Head>
        <title>Random Real Text Generator</title>
      </Head>
      <div className='bg-stone-100 p-8'>
        <div className='text-center pb-8'>
          <h1 className='text-3xl font-bold'>Random Text Generator</h1>
        </div>
        <div className='max-w-5xl mx-auto min-h-screen'>
          <div className='flex justify-between'>
            <div className='bg-white p-4 rounded-sm shadow-md w-[60%]'>
              <TextareaAutosize ref={ref} autoFocus placeholder='Paste text data here' className='w-full p-2 outline-none inline-block' minRows={10} />
            </div>
            <div className='px-8 py-2 w-[40%] space-y-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label className='font-bold'>Length</label>
                  <input onChange={(e) => setTotalText(e.target.value)} className='p-2 rounded shadow-sm w-full outline-none' placeholder='Default: 1' />
                </div>
                <div className='space-y-2'>
                  <label className='font-bold'>Text Length</label>
                  <input onChange={(e) => setTextLength(e.target.value)} className='p-2 rounded shadow-sm w-full outline-none' placeholder='Default: 12' />
                </div>
                <button onClick={submitGenerate} className='bg-sky-400 px-8 py-2 rounded text-white font-bold'>Generate</button>
              </div>
              <h2 className='font-bold'>Result</h2>
              <div className='space-y-4'>
                {vals.map(item => (
                  <div key={nanoid()}>
                    <div className='bg-white p-4 shadow-sm rounded'>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
