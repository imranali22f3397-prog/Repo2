'use client';
import {useState} from 'react';

type Config={date:string;recipientName:string;password:string;messages:string[];letter:string;wishes:string[];photos:string[]};
const empty:Config={date:'',recipientName:'',password:'',messages:['','','',''],letter:'',wishes:['','','',''],photos:[]};
const steps=['The date',"Their name","Set password",'Little messages','A letter','Their wishes','Favorite photos'];

export default function Create(){
  const [step,S]=useState(0);
  const [data,D]=useState<Config>(empty);
  const [count,C]=useState(4);
  const [photoCount,PC]=useState(3);
  const [busy,B]=useState(false);
  const [link,L]=useState('');
  const [error,E]=useState('');
  const [copied,CP]=useState(false);
  const [progress,PR]=useState('');
  const [previewMode,PM]=useState(false);

  const update=(key:keyof Config,val:any)=>D(d=>({...d,[key]:val}));
  const setMessage=(i:number,v:string)=>update('messages',data.messages.map((m,j)=>i===j?v:m));
  const setWish=(i:number,v:string)=>update('wishes',data.wishes.map((m,j)=>i===j?v:m));

  async function filesPicked(list:FileList|null){
    if(!list)return;
    const room=photoCount-data.photos.length;
    const selected=Array.from(list).slice(0,room>0?room:photoCount);
    const keep=room>0?data.photos:[];
    try{
      const urls=await Promise.all(selected.map(f=>new Promise<string>((resolve,reject)=>{
        const u=URL.createObjectURL(f);
        const img=new Image();
        img.onload=()=>{
          const max=1280;
          const k=Math.min(1,max/Math.max(img.width,img.height));
          const c=document.createElement('canvas');
          c.width=Math.round(img.width*k);
          c.height=Math.round(img.height*k);
          const ctx=c.getContext('2d')!;
          ctx.fillStyle='#fff';
          ctx.fillRect(0,0,c.width,c.height);
          ctx.drawImage(img,0,0,c.width,c.height);
          URL.revokeObjectURL(u);
          resolve(c.toDataURL('image/jpeg',0.8));
        };
        img.onerror=()=>{
          URL.revokeObjectURL(u);
          reject(new Error('Could not read one of the photos.'));
        };
        img.src=u;
      })));
      update('photos',[...keep,...urls]);
      E('');
    }catch(e:any){
      E(e.message||'Could not read one of the photos.');
    }
  }

  function valid(){
    if(step===0&&!data.date)return 'Choose the birthday date first.';
    if(step===1&&!data.recipientName.trim())return 'Please enter the recipient\'s name.';
    if(step===2&&!data.password.trim())return 'Please set a password.';
    if(step===3&&data.messages.some(x=>!x.trim()))return 'Please fill in all four messages.';
    if(step===4&&!data.letter.trim())return 'Write a little letter before continuing.';
    if(step===5&&(data.wishes.length!==count||data.wishes.some(x=>!x.trim())))return 'Please fill in each wish.';
    if(step===6&&data.photos.length!==photoCount)return `Please choose ${photoCount} photos.`;
    return '';
  }

  const canPreview=step===6&&!valid();

  async function next(){
    const e=valid();
    if(e){
      E(e);
      return;
    }
    E('');
    if(step<6){
      S(step+1);
      return;
    }
    B(true);
    try{
      const photoData:{id:string;ext:string}[]=[];
      for(let i=0;i<data.photos.length;i++){
        PR(`Uploading photo ${i+1} of ${data.photos.length}…`);
        const blob=await (await fetch(data.photos[i])).blob();
        const u=await fetch('/api/photo',{method:'POST',headers:{'Content-Type':blob.type||'image/jpeg'},body:blob});
        const uj=await u.json().catch(()=>({error:u.status===413?'One of your photos is too large. Please choose a smaller image.':'Could not upload a photo. Please try again.'}));
        if(!u.ok)throw new Error(uj.error||'Could not upload a photo.');
        photoData.push({id:uj.id,ext:uj.ext||'jpg'});
      }
      PR('Creating your link…');
      const r=await fetch('/api/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,photos:photoData})});
      const j=await r.json().catch(()=>({error:r.status===413?'Your photos are too large. Please choose smaller images.':'Could not create link. Please try again.'}));
      if(!r.ok)throw new Error(j.error||'Could not create link');
      L(`${location.origin}/b/${j.id}`);
    }catch(e:any){
      E(e.message||'Something went wrong.');
    }finally{
      B(false);
      PR('');
    }
  }

  return <main className="wizardpage">
    <header className="wizardnav">
      <a className="brand" href="/"><span className="brandmark">♥</span> bloom<span className="brandlight">day</span></a>
      <span className="secure">✦ A surprise in the making</span>
    </header>
    <section className="wizard">
      <div className="wizardhead">
        <div className="eyebrow">LET'S MAKE SOMETHING MEANINGFUL</div>
        <h1>{link?'Your link is ready!':<>A little detail,<br/><em>a lot of love.</em></>}</h1>
        <p>{link?'Send this special link to the birthday person.': 'Build a personal birthday moment, one step at a time.'}</p>
      </div>
      {link?<div className="success">
        <div className="successicon">♥</div>
        <h2>Ready to make them smile?</h2>
        <p>Your birthday experience has been created. Copy the link and send it their way.</p>
        <div className="linkbox">{link}</div>
        <button className="primary full" onClick={()=>navigator.clipboard.writeText(link).then(()=>{CP(true);setTimeout(()=>CP(false),2000)}).catch(()=>E('Copy failed. Please copy the link above manually.'))}>{copied?'Copied! ♥':'Copy birthday link ↗'}</button>
        {error&&<p className="error">{error}</p>}
        <button className="back again" onClick={()=>{L('');D(empty);C(4);PC(3);S(0);E('')}}>Create another surprise</button>
        <a className="textlink" href={link} target="_blank">Preview experience →</a>
      </div>:<>
        <div className="progress">
          <div className="progresslabels"><span>STEP 0{step+1} <b>OF 07</b></span><span>{steps[step]}</span></div>
          <div className="track"><div style={{width:`${(step+1)*(100/7)}%`}}/></div>
          <div className="stepdots">{steps.map((x,i)=><span className={i<=step?'active':''} key={x}/>)}</div>
        </div>
        <div className="formcard">
          <div className="formtitle">
            <span className="stepicon">{['♧','◈','🔒','✉','♡','✧','▧'][step]}</span>
            <div>
              <h2>{['When is their day?',"What's their name?",'Set a password','Four little messages','A letter from you','Make a few wishes','Moments worth keeping'][step]}</h2>
              <p>{['Set the date for your birthday surprise.','Enter the name of the birthday person.','Create a password to protect this surprise.','Add four short notes they\'ll discover.','Write something straight from the heart.','Choose how many wishes they can make.','Add photos that tell your story.'][step]}</p>
            </div>
          </div>
          {step===0&&<div className="field">
            <label>THE BIRTHDAY DATE</label>
            <input type="date" value={data.date} onChange={e=>update('date',e.target.value)}/>
            <small>We'll use this to personalize their experience.</small>
          </div>}
          {step===1&&<div className="field">
            <label>RECIPIENT'S NAME</label>
            <input type="text" placeholder="e.g., Sarah" value={data.recipientName} onChange={e=>update('recipientName',e.target.value)}/>
            <small>This will personalize their birthday experience.</small>
          </div>}
          {step===2&&<div className="field">
            <label>PASSWORD</label>
            <input type="text" placeholder="Create a password" value={data.password} onChange={e=>update('password',e.target.value)}/>
            <small>The recipient will need this password to unlock their surprise.</small>
          </div>}
          {step===3&&<div className="fields">
            {data.messages.map((m,i)=><div className="field" key={i}>
              <label>MESSAGE 0{i+1}</label>
              <input maxLength={140} placeholder={['A reason you make me smile…','A little memory I love…','Something I admire about you…','A wish for your year ahead…'][i]} value={m} onChange={e=>setMessage(i,e.target.value)}/>
              <small>{m.length}/140</small>
            </div>)}
          </div>}
          {step===4&&<div className="field">
            <label>YOUR LETTER</label>
            <textarea rows={7} maxLength={1800} placeholder="Dear you,&#10;&#10;There are so many things I want you to know..." value={data.letter} onChange={e=>update('letter',e.target.value)}/>
            <small>{data.letter.length}/1800 characters</small>
          </div>}
          {step===5&&<>
            <label className="standalone">HOW MANY WISHES?</label>
            <div className="choicegrid">
              {[2,4,6].map(n=><button className={`choice ${count===n?'chosen':''}`} key={n} onClick={()=>{C(n);update('wishes',Array.from({length:n},(_,i)=>data.wishes[i]||''))}}>
                <strong>{n}</strong>
                <span>{n===2?'A couple':n===4?'A handful':'The whole sky'}</span>
              </button>)}
            </div>
            <div className="fields wishfields">
              {data.wishes.map((w,i)=><div className="field" key={i}>
                <label>WISH 0{i+1}</label>
                <input maxLength={100} placeholder="A wish they can make…" value={w} onChange={e=>setWish(i,e.target.value)}/>
              </div>)}
            </div>
          </>}
          {step===6&&<>
            <label className="standalone">CHOOSE PHOTO COUNT</label>
            <div className="choicegrid">
              {[2,3,4,6].map(n=><button className={`choice ${photoCount===n?'chosen':''}`} key={n} onClick={()=>{PC(n);update('photos',data.photos.slice(0,n))}}>
                <strong>{n}</strong>
                <span>{n===2?'A pair':'Photos'}</span>
              </button>)}
            </div>
            <label className="upload">
              <input type="file" accept="image/*" multiple onChange={e=>{filesPicked(e.target.files);e.target.value=''}}/>
              <span className="uploadicon">＋</span>
              <b>Choose your photos</b>
              <span>{data.photos.length>=photoCount?'All set! Choose again to replace them':`Select ${photoCount-data.photos.length} more image${photoCount-data.photos.length===1?'':'s'} from your device`}</span>
            </label>
            {data.photos.length>0&&<div className="photogrid">
              {data.photos.map((p,i)=><div className="thumb" key={i}>
                <img src={p} alt={`Selected memory ${i+1}`}/>
                <button type="button" aria-label="Remove photo" onClick={()=>update('photos',data.photos.filter((_,j)=>j!==i))}>×</button>
              </div>)}
            </div>}
            <small className="hint">{data.photos.length}/{photoCount} photos · included in the private birthday link.</small>
          </>}
          {error&&<p className="error">{error}</p>}
          <div className="formactions">
            {step>0&&<button className="back" onClick={()=>{E('');S(step-1)}}>← Back</button>}
            {canPreview&&<button className="secondary" onClick={()=>PM(true)}>Preview →</button>}
            <button className="primary next" onClick={next} disabled={busy}>{busy?(progress||'Creating…'):step===6?'Generate my link':'Continue →'}</button>
          </div>
        </div>
      </>}
    </section>
    <footer>MADE TO CELEBRATE YOUR FAVORITE PEOPLE <span>♥</span></footer>
    {previewMode&&<div className="preview-modal">
      <div className="preview-content">
        <div className="preview-header">
          <h2>Preview</h2>
          <button className="close-preview" onClick={()=>PM(false)}>×</button>
        </div>
        <div className="preview-body">
          <p>This is a preview of how the birthday experience will look for the recipient.</p>
          <p><strong>Recipient:</strong> {data.recipientName}</p>
          <p><strong>Date:</strong> {data.date}</p>
          <p><strong>Messages:</strong> {data.messages.filter(m=>m.trim()).length}/4</p>
          <p><strong>Wishes:</strong> {data.wishes.filter(w=>w.trim()).length}</p>
          <p><strong>Photos:</strong> {data.photos.length}</p>
        </div>
      </div>
    </div>}
  </main>;
}
