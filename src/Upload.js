/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
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
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const uploadRef = useRef(null);
    const handleRadioChange = (value) => {
        setPaid(value);
    }
    const handleCategoryChange = (value) => {
        setCategory(value);
        setDropdown(false);
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
    useEffect(()=>{
        function clickoutsidedropdown(e){
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setDropdown(false);
            }
        }
        function clickoutsideupload(e){
            if(uploadRef.current && !uploadRef.current.contains(e.target)){
                onClose();
            }
        }
        document.addEventListener("mousedown", clickoutsidedropdown);
        document.addEventListener("mousedown", clickoutsideupload);
        return () => {
        document.removeEventListener("mousedown", clickoutsidedropdown);
        document.removeEventListener("mousedown", clickoutsideupload);
        };
    }, [onClose])
    return (
        <div className="uploadform" ref={uploadRef}>
            <div className="uploadformHeader">Enter the details of the dataset</div>
            <div className="uploadformBody">
                <div className="dropdownContainer">
                    <label className="dropdownLabel" onClick={()=>{setDropdown(!dropdown)}}>Category ⏷ <span className="dropdownSelected">{category}</span></label>
                    {
                        dropdown && 
                        <div ref={dropdownRef} className="dropdown" >
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Acne")}}>Acne</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Pigmentation")}}>Pigmentation</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Redness")}}>Redness</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Eyebag")}}>Eyebag</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Darkcircle")}}>Darkcircle</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Finelines")}}>Finelines</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Wrinkles")}}>Wrinkles</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Whiteheads")}}>Whiteheads</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Blackheads")}}>Blackheads</div>
                            <div className="dropdownItems" onClick={()=>{handleCategoryChange("Mixed")}}>Mixed</div>
                        </div>
                    }
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