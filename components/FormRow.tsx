import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useState} from "react";

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

const FormRow = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            {
                props.liList.map(item => {
                    if (item) {
                        return (
                            <Grid item xs={4} onClick={() => {
                                props.click(item.url);
                            }}>
                                <Paper style={{backgroundColor: props.clicked == item.url ? "#006cff" : ""}}
                                       className={classes.paper}><img
                                    src={item.mark}/>{item.play_item + '、' + item.title.substring(0,5)}</Paper>
                            </Grid>)
                    } else {
                        return
                    }

                })
            }
        </React.Fragment>
    );
}
export default FormRow
