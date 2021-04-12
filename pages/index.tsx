import React from 'react';
import {useState} from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useRouter} from 'next/router'
import {baseurl} from '../url'

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // 头部样式
        header: {
            padding: '2px 4px',
            marginTop: '5px',
            marginBottom: '5px',
            display: 'flex',
            alignItems: 'center',
        },
        // 选择框
        clsSelect: {
            // padding: '2px',
            // marginLeft: '10px',
            // marginLeft: theme.spacing(1),
            flex: 1,
        },
        // 搜索框
        input: {
            marginLeft: theme.spacing(1),
            flex: 3,
        },
        // 搜索按钮
        iconButton: {
            padding: 10,
        },
    }),
);

// {data}: InferGetServerSidePropsType<typeof getServerSideProps>
const Home = (props) => {
    const classes = useStyles();
    // 定义state
    // 播放源
    const [origin, setOrigin] = useState('tx');
    // 搜索关键字
    const [keywords, setKeywords] = useState('');
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter()
    // 选择框处理事件
    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOrigin(event.target.value as string);
    };
    // 输入框处理事件
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
    };
    // 搜索事件
    const handleSearch = (event) => {
        // 这里要进行网络请求渲染列表
        setIsSearching(true)
        fetch(baseurl+'/api/search?cls=' + origin + '&data=' + keywords).then((response) => {
            response.json().then((data) => {
                setData(data)
                setIsSearching(false)
            })
        })
        // console.log(keywords, origin)
    }

    const handlePlay = (playData) => {
        router.push({pathname: '/play', query: playData})
    }
    return (
        <React.Fragment>
            <meta name="referrer" content="no-referrer"/>
            <CssBaseline/>
            <Container maxWidth="md">
                <Paper component="form" className={classes.header}>

                    <Select
                        className={classes.clsSelect}
                        value={origin}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value={'tx'}>腾讯</MenuItem>
                        <MenuItem value={'qiy'}>爱奇艺</MenuItem>
                        <MenuItem value={'uk'}>优酷</MenuItem>
                    </Select>


                    <InputBase
                        className={classes.input}
                        placeholder="搜一下"
                        inputProps={{'aria-label': '搜一下'}}
                        value={keywords}
                        onChange={handleInputChange}
                    />
                    <IconButton type="button" className={classes.iconButton} aria-label="search" onClick={handleSearch}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
                <div style={{textAlign: 'center'}}>{isSearching ? <CircularProgress/> : data.length == 0 ?
                    <Alert severity="info">搜一下别的吧!</Alert> : ""}</div>
                <GridList cellHeight={280} cols={2}>
                    {data.map((tile) => (
                        <GridListTile key={tile.img}
                                      onClick={() => handlePlay({"url": tile.url, "cls": origin})}
                        >
                            <img src={tile.img}/>
                            <GridListTileBar
                                title={tile.title}
                                // subtitle={<span>by: {tile.author}</span>}
                                // actionIcon={
                                //     <IconButton aria-label={`info about ${tile.title}`}>
                                //     </IconButton>
                                // }
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </Container>
        </React.Fragment>
    )
}

export default Home
