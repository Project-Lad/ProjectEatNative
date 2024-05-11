import {YELP_API_KEY} from '@env'
import React from 'react';
import * as Sentry from "@sentry/react-native";

const Data = async (zip, categories, offset, distance, latitude, longitude) => {
    //declare variables
    let apicategories = "";
    let counter = 0;
    let restaurantData;
    //loop through the categories
    while (categories[counter] != null) {
        //add to the api categories
        apicategories += categories[counter];
        apicategories += ",";
        counter++;
    }
    //remove the last comma
    apicategories = apicategories.slice(0, -1)
    //set the headers
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${YELP_API_KEY}`);
    //set the request options
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    //if the zip is null, use the lat and long
    if (zip === null) {
        //fetch the yelp data
        await fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&limit=50&offset=${offset}&radius=${parseInt(distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
            //convert to json
            .then(response => response.json())
            .then(result => {
                //set the restaurant data
                restaurantData = result.businesses
            })
            .catch((error) => {
                Sentry.captureException(error.message);
            });
        return restaurantData;
    } else {
        //fetch the yelp data
        await fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${zip}&limit=50&offset=${offset}&radius=${parseInt(distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
            //convert to json
            .then(response => response.json())
            .then(result => {
                //set the restaurant data
                restaurantData = result.businesses
            })
            .catch((error) => {
                Sentry.captureException(error.message);
            });

        return restaurantData
    }
}

export default Data;
