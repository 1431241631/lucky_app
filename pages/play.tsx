import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {useEffect, useState} from "react";
import * as queryString from "querystring";
import {baseurl} from '../url'
const Player = dynamic(
    () => import('../components/player'),
    {ssr: false}
)


// @ts-ignore
const Play = (props) => {
    const router = useRouter()
    const [data, setData] = useState([])
    useEffect(() => {
        if (router.query.url) {
            fetch(baseurl+'/api/playvideolist', {
                method: "POST",
                body: queryString.stringify({"url": router.query.url, "cls": router.query.cls}),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then((response) => {
                response.json().then((data) => {
                    setData(data)
                    console.log(data)
                })
            })
        }

    }, [router])
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container maxWidth="md">
                <Player dataList={data} cls={router.query.cls}></Player>
            </Container>
        </React.Fragment>
    )
}


export default Play
