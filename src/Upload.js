/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./Upload.css";
import { supabase } from './utils/supabase.js'

export default function Upload({onClose}) {
    const [category, setCategory] = useState("");
    const [link, setLink] = useState("");
    const [paid, setPaid] = useState("");
    const [numImages, setNumImages] = useState("");
    const [au, setAu] = useState("");
    const [uploadedBy, setUploadedBy] = useState("");
    const [notes, setNotes] = useState("");
    const handleRadioChange = (value) => {
        setPaid(value);
    }
    const handleCategoryChange = (value) => {
        setCategory(value);
    }
    const handleSubmit = async () => {
        if (!category || !link || !paid || !numImages || !au || !uploadedBy) {
            alert("Please fill all the fields");
            return;
        }
        const data = await supabase
            .from('databoard')
            .select('entryid')
            .single();
        if (data.entryid === await hashLink(link)) {
            alert("This link already exists in the database");
            return;
        }
        async function hashLink(link) {
            const encoder = new TextEncoder();
            const data = encoder.encode(link);

            const hashBuffer = await crypto.subtle.digest("SHA-256", data);

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");

            return hashHex;
        }
        async function insertData (){
            
            const currentTime = new Date().toISOString();
            const { data, error } = await supabase
                .from('databoard')
                .insert([
                    {
                        entryid: await hashLink(link),
                        category: category,
                        link: link,
                        pricing: paid,
                        nimages: numImages,
                        au: au,
                        uploadedby: uploadedBy,
                        uploadedtime: currentTime,
                        notes: notes,
                    }
                ]);
            if (error) {
                alert("Error inserting data, this might be because the link already exists in the database");
            } else {
                alert("Data inserted successfully");
            }
        }
        await insertData();
        window.location.reload();

    }
    return (
        <div className="uploadform">
            <div className="uploadformHeader">Enter the details of the dataset</div>
            <div className="uploadformBody">
                <label>Category: </label>
                <div className="radioGroup">
                    <div>
                        <input name="category" checked={category==="Acne"} type="radio" onChange={()=>{handleCategoryChange("Acne")}} />
                        <label>Acne</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Pigmentation"} type="radio" onChange={()=>{handleCategoryChange("Pigmentation")}} />
                        <label>Pigmentation</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Redness"} type="radio" onChange={()=>{handleCategoryChange("Redness")}} />
                        <label>Redness</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Eyebag"} type="radio" onChange={()=>{handleCategoryChange("Eyebag")}} />
                        <label>Eyebag</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Darkcircle"} type="radio" onChange={()=>{handleCategoryChange("Darkcircle")}} />
                        <label>Darkcircle</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Finelines"} type="radio" onChange={()=>{handleCategoryChange("Finelines")}} />
                        <label>Finelines</label>    
                    </div>
                    <div>
                        <input name="category" checked={category==="Wrinkles"} type="radio" onChange={()=>{handleCategoryChange("Wrinkles")}} />
                        <label>Wrinkles</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Whiteheads"} type="radio" onChange={()=>{handleCategoryChange("Whiteheads")}} />
                        <label>Whiteheads</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Blackheads"} type="radio" onChange={()=>{handleCategoryChange("Blackheads")}} />
                        <label>Blackheads</label>
                    </div>
                    <div>
                        <input name="category" checked={category==="Mixed"} type="radio" onChange={()=>{handleCategoryChange("Mixed")}} />
                        <label>Mixed</label>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Link: </label>
                        <input type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
                    </div>
                </div>
                <div className="radioGroup">
                    <div>Pricing:</div>
                    <div>
                        <input name="paid" checked={paid==="paid"} type="radio" onChange={()=>{handleRadioChange("paid")}} />
                        <label>Paid</label>
                    </div>
                    <div>
                        <input name="paid" checked={paid==="free"} type="radio" onChange={()=>{handleRadioChange("free")}} />
                        <label>Free</label>
                    </div>
                </div>
                <div>
                    <label>Number of Images: </label>
                    <input type="text" placeholder="NumImages" value={numImages} onChange={(e) => setNumImages(e.target.value)} />
                </div>
                <div>
                    <label>A/U: </label>
                    <input type="text" placeholder="A/U" value={au} onChange={(e) => setAu(e.target.value)} />
                </div>
                <div>
                    <label>Uploaded By: </label>
                    <input type="text" placeholder="UploadedBy" value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} />
                </div>
                <div>
                    <input type="text" placeholder="notes" value={notes} onChange={(e)=>{setNotes(e.target.value)}} />
                </div>
                <button type="button" onClick={()=>{handleSubmit()}} className="submitButton">Submit</button>
                <button type="button" onClick={()=>{onClose()}} className="closeButton">Close</button>
            </div>
        </div>
    )
}