
import {YELP_API_KEY} from '@env'
import React, {useEffect, useState} from 'react';
import firebase from "../firebase";
const geofire = require('geofire-common')
const zipcodes = require('zipcodes')

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
                /*console.log("Categories: " + apicategories)*/
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

export const FirebaseData = async (zip, categories, offset, distance, latitude, longitude)  => {
    let restaurantData;
    if(zip !== null){
        let result = zipcodes.lookup(zip)
        console.log("Zip: ", zip)
        console.log("Result: ",result)
    }

    const center = [latitude, longitude];
    const radiusInM = 1609;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
        const q = firebase.firestore().collection('restaurants')
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);

        promises.push(q.get());
    }

    // Collect all the query results together into a single list
    await Promise.all(promises).then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const lat = doc.get('latitude');
                const lng = doc.get('longitude');
                const name = doc.get('name');
                const price_range = doc.get('price_range');
                const location = doc.get('location');
                const rating = doc.get('rating');
                const review_count = doc.get('review_count');
                const phone_numbers = doc.get('phone_numbers')
                const imageURL = doc.get('imageURL')
                const businessURL = doc.get('businessURL')
                const id = doc.id

                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distance = distanceInKm * 1000;
                if (distance <= radiusInM) {
                    matchingDocs.unshift({
                        id,
                        lat,
                        lng,
                        name,
                        distance,
                        price_range,
                        location,
                        rating,
                        review_count,
                        phone_numbers,
                        imageURL,
                        businessURL
                    });
                }
            }
        }

        return matchingDocs;
    }).then((matchingDocs) => {
        console.log(matchingDocs)
        restaurantData = matchingDocs
    })

    return restaurantData;
}

export default Data;