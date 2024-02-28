"use server"
export async function handlePostImgur(formData: FormData) {
    const response = await fetch("https://api.imgur.com/3/image/", {
        method: "POST",
        headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
        body: formData
    })
    const res = await response.json();
    return res;
}

export async function handleGetAllImage() {
    const response = await fetch("https://api.imgur.com/3/account/me/submissions/", {
        method: "POST",
        headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` }
    })
    // console.log("response", response)
    // const res = await response.json();
    // return res;
}