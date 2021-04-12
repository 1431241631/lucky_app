import React from 'react';
import {useState, useEffect} from "react";
import DPlayer from 'dplayer';
import Hls from 'hls.js'
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormRow from "./FormRow";
import * as queryString from "querystring";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import {baseurl} from '../url'

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        player: {
            marginTop: '15px'
        },
        datalist: {
            flexGrow: 1,
            marginTop: '10px'
        },
        paper: {
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

const Play = (props) => {
    const classes = useStyles();
    const [clicked, setClicked] = useState('')
    const [playData, setPlayData] = useState({
        url: "",
        type: "mp4"
    });
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const dp = new DPlayer({
            container: document.getElementById('dplayer'),
            video: {
                url: playData.url,
                type: playData.type == "hls" ? "customHls" : playData.type,
                customType: {
                    customHls: function (video, player) {
                        const hls = new Hls();
                        hls.loadSource(video.src);
                        hls.attachMedia(video);
                    },
                },
            }
        });
    }, [playData])


    const play_video = (url) => {
        setLoading(true)
        setClicked(url);
        fetch(baseurl+"/api/transformvideo?" + queryString.stringify({
            "url": encodeURIComponent(url),
            "cls": props.cls
        })).then((response) => {
            response.json().then((data) => {
                setLoading(false)
                setPlayData({
                    url: data.url,
                    type: data.type
                })
            })
        })

    }

    return (
        <React.Fragment>
            <div className={classes.player}>
                <div id='dplayer'></div>
            </div>
            <div style={loading ? {textAlign: 'center'} : {display: 'none'}}>
                <Alert severity="info">加载中!</Alert>
            </div>
            <div className={classes.datalist}>
                <Grid container spacing={1}>
                    {
                        props.dataList.map((item, index) => {
                            if ((index + 1) % 3 == 0) {
                                let liList = [props.dataList[index - 2], props.dataList[index - 1], props.dataList[index]]
                                return (
                                    <Grid container item xs={12} spacing={3}>
                                        <FormRow liList={liList} click={play_video} clicked={clicked}/>
                                    </Grid>
                                )
                            } else if (parseInt(String(props.dataList.length / 3)) * 3 - 1 < index) {
                                if(parseInt(String(props.dataList.length / 3)) * 3 - 1 < index - 1)
                                    return
                                let liList = [props.dataList[index], props.dataList[index + 1], props.dataList[index + 2]]
                                return (
                                    <Grid container item xs={12} spacing={3}>
                                        <FormRow liList={liList} click={play_video} clicked={clicked}/>
                                    </Grid>
                                )
                            }
                        })
                    }
                </Grid>
            </div>
        </React.Fragment>
    )
}

export default Play
