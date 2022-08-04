
import {YELP_API_KEY} from '@env'
import React, {useEffect, useState} from 'react';

const Data = async (zip, categories, offset, distance, latitude, longitude) => {
    let apicategories = "";
    let counter = 0;
    let restaurantData;

    while (categories[counter] != null) {
        //add to the api categories
        apicategories += categories[counter];
        apicategories += ",";
        counter++;
    }

    apicategories = apicategories.slice(0, -1)

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${YELP_API_KEY}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    if (zip === null) {
        await fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&limit=50&offset=${offset}&radius=${parseInt(distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log("Latitude: " + latitude)
                //console.log("Longitude: " + longitude)
                //console.log("Offset: " + props.offset)
                //console.log("Distance: " + parseInt((props.distance * 1609)))
                console.log("Categories: " + apicategories)
                restaurantData = result.businesses
            })
            .catch(error => console.log('error', error));

        return restaurantData;
    } else {
        await fetch(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${zip}&limit=50&offset=${offset}&radius=${parseInt(distance * 1609)}&sort_by=distance&categories=${apicategories}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                restaurantData = result.businesses
                //console.log(result.businesses);
            })
            .catch(error => console.log('error', error));

        return restaurantData
    }
}

export default Data;