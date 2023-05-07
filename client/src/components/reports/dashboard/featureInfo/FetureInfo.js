import React from 'react'
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { Card, CardContent, Grid, Typography } from '@material-ui/core';

const FetureInfo = () => {
  return (
    <>
    <Grid container spacing={3} 
        justifyContent="center" 
        alignItems="center">
        <Grid item xs={3}>
            <Card>
                <CardContent>
                    <Typography color="primary" gutterBottom align='left'>
                        Monthly Active Users
                    </Typography>
                    <Grid container 
                        spacing={3} 
                        direction="row"
                        justifyContent="start"
                        alignItems="center">
                        <Grid item xs={6} >
                            <Typography variant="h3" component="h3">
                                100
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="h5">
                                <ArrowDownward color="primary"/> 100%
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography color="textSecondary" gutterBottom align='left'>
                        Compared from last month
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={3}>
            <Card>
                <CardContent>
                    <Typography color="primary" gutterBottom align='left'>
                        Monthly Skills
                    </Typography>
                    <Grid container 
                        spacing={3} 
                        direction="row"
                        justifyContent="start"
                        alignItems="center">
                        <Grid item xs={6} >
                            <Typography variant="h3" component="h2">
                                100
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" component="h2">
                                <ArrowUpward color="secondary"/> 100%
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography color="textSecondary" gutterBottom align='left'>
                        Compared from last month
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
        
    </>
  )
}

export default FetureInfo