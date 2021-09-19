import React, { useState, useEffect } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import Alertmessage from './Alertmessage';
import { Bar } from 'react-chartjs-2';
const Add = () => {
    const [author, setAuthor] = useState({
        author: ""
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [image, setImage] = useState([])
    const [loading, setLoading] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [statdata, setStatData] = useState([])
    const [message, setMessage] = useState("");
    var base64String = ""

    let data = {
        labels: statdata.map((val) => {
            return (
                val._id.split('T')[0]
            )
        }),

        datasets: [{
            label: '# of Votes',
            data: statdata.map((val) => {
                return (
                    val.sum
                )
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 159, 64, 1)',

            ],
            borderWidth: 1
        }]
    }

    const getData = async (e) => {

        const res = await fetch("http://localhost:4000/api/meme", {
            mthod: "GET"
        })
        const data = await res.json()
        setImage(data)
        setLoading(false)
    }

    const getStat = async () => {
        const res = await fetch("http://localhost:4000/api/stat", {
            method: "GET"
        })
        const stat = await res.json()
        console.log(stat)
        stat.sort((a, b) => -a._id.localeCompare(b._id))
        setStatData(stat)
        console.log(stat)
    }

    const postData = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('author', author.author);
        console.log(selectedFile);

        const res = await fetch('http://localhost:4000/api/meme', {
            method: "POST",
            body: formData
        })

        var data = await res.json()
        console.log(data)
        if (res.status !== 200) {
            console.log(data.message)
            setMessage(data.message);
        }
        else {
            setMessage(data.message);
            console.log(data.message)
        }

        setAuthor({ author: "" })

        getData();

    }
    const onChangeHandle = (e) => {
        setSelectedFile(e.target.files[0])
    }
    const changeToggle = () => {
        getStat();
        setToggle(!toggle)
    }
    const changeAuthor = (e) => {
        let name = e.target.name
        let value = e.target.value
        setAuthor({ [name]: value })
    }
    useEffect(() => {
        setLoading(true)
        getData();
    }, [])
    return (
        <div className="container ">
            {message ? <Alertmessage message={message} /> : null}
            {
                loading ? (<div className="show-pic"><BeatLoader color={"#36D7B7"} loading={loading} size={100} /></div>)
                    :


                    (

                        <>
                            {

                                toggle ? (

                                    <>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button className="show-stat btn btn-primary  mt-5" onClick={changeToggle}>Show Gallery</button>
                                        </div>

                                        <div className="mb-5 mt-5">
                                            <Bar
                                                data={data}
                                                width={600}
                                                height={400}
                                            />
                                        </div>

                                    </>
                                ) :
                                    (<>
                                        <h1 className="meme-head mt-5">MEME GALLERY</h1>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button className="show-stat btn btn-primary" onClick={changeToggle}>Show stat</button>
                                        </div>


                                        <form onSubmit={postData}>
                                            <div className="row mt-5 d-flex justify-content-center align-items-center form-div">
                                                <div className="col-md-6 d-flex justify-content-center align-items-center mt-3" >
                                                    <input type="text" name="author" placeholder="Author Name" value={author.author} onChange={changeAuthor} />
                                                    <input type="file" name="file" accept="image/*" onChange={onChangeHandle} />
                                                </div>
                                                <div className="col-md-6 d-flex justify-content-center mt-3" >
                                                    <input type="submit" value="submit" />

                                                </div>
                                            </div>
                                        </form>

                                        <div className="row mt-5 d-flex justify-content-center align-items-center">
                                            {

                                                image.map((val, ind) => {
                                                    var base64Flag = `data:${val.image.contentType};base64,`;
                                                    base64String = Buffer.from(val.image.data.data, 'hex').toString('base64')

                                                    return (
                                                        <>
                                                            <div className="col-md-4 mt-3 " key={ind}>
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <img src={base64Flag + base64String} alt="webpic" className="img-fluid meme" style={{ width: "400px", height: "400px" }} />
                                                                </div>

                                                                <h4 className="d-flex justify-content-center align-items-center font-weight-bolder mt-3 mb-3 author">Author: {val.author}</h4>
                                                            </div>

                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>)
                            }


                        </>)
            }

        </div>
    )
}

export default Add
