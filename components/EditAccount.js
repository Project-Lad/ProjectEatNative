import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
    LogBox, ActivityIndicator
} from 'react-native';
import {getStorage, ref, getDownloadURL, deleteObject, uploadBytes, uploadBytesResumable} from "firebase/storage";
import {getAuth, updateProfile} from "firebase/auth";
import {getFirestore, doc, setDoc, deleteDoc} from "firebase/firestore";
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";
import * as Sentry from "@sentry/react-native";
import {InputStyles, IconStyles, ProfileStyles} from "./InputStyles";
import {Ionicons} from '@expo/vector-icons';

LogBox.ignoreLogs(['Setting a timer']);
import * as WebBrowser from 'expo-web-browser';
import userPhoto from "../assets/user-placeholder.png";
import {manipulateAsync, FlipType, SaveFormat} from 'expo-image-manipulator';
import * as MailComposer from "expo-mail-composer";

export default function EditAccount() {
    const navigation = useNavigation()
    const auth = getAuth()
    const currentUser = auth.currentUser;
    const storage = getStorage();
    const userUid = auth.currentUser.uid;
    const firestore = getFirestore();
    const [newProfileUsername, setNewProfileUsername] = useState({displayName: currentUser.displayName})
    const [newProfilePicture, setNewProfilePicture] = useState({photoURL: currentUser.photoURL})
    const [result, setResult] = useState(null);
    const [updateDisable, setUpdateDisable] = useState(true)
    const [isLoading, setIsLoading] = useState(false);
    const [percent, setPercent] = useState(0);
    const [isFocused, setIsFocused] = useState(false)
    const [isProfilePicUpdated, setProfilePicUpdated] = useState(false);

    useEffect(() => {
        const profilePictureRef = ref(storage, `${userUid}/profilePicture`);
        getDownloadURL(profilePictureRef)
            .then((url) => {
                setNewProfilePicture({photoURL: url});
            })
            .catch(() => {
                setNewProfilePicture({
                    photoURL: Image.resolveAssetSource(userPhoto).uri,
                });
            });

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => true
        );
        return () => backHandler.remove();
    }, []);

    function userName() {
        updateProfile(currentUser, {
            displayName: newProfileUsername.displayName,
            photoURL: newProfilePicture.photoURL
        })
            .then(async () => {
                /*
                    * compresses image and converts to PNG
                    * uploads image to Firebase Storage
                    *
                */
                if(isProfilePicUpdated){
                    const newImage = await manipulateAsync(newProfilePicture.photoURL, [], {
                        compress: 1,
                        format: SaveFormat.PNG
                    })
                    const img = await fetch(newImage.uri);
                    const blob = await img.blob();
                    const fileRef = ref(storage, `${currentUser.uid}/profilePicture`);
                    const uploadTask = uploadBytesResumable(fileRef, blob);
                    uploadTask.on('state_changed', snapshot => {
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                            setIsLoading(true)
                            setPercent(progress);
                        },
                        (error) => Sentry.captureException(error.message),
                        () => {
                            setIsLoading(false)
                            setUpdateDisable(true)
                            setProfilePicUpdated(false);
                        }
                    );
                }

                // updates user profile picture
                // updates user document in Firestore
                const userDocRef = doc(firestore, "users", currentUser.uid);
                setDoc(
                    userDocRef,
                    {
                        username: newProfileUsername.displayName,
                        photoURL: newProfilePicture.photoURL,
                    },
                    {merge: true}
                ).then(() => {setUpdateDisable(true)})
            }).catch((error) => {
                Sentry.captureException(error.message);
            });
    }
    const UploadLoader = () => {
        return (
            <View style={ProfileStyles.modalView}>
                <ActivityIndicator size="large" color="#333"/>
                <Text style={{textAlign:'center'}}>Uploading Image...</Text>
                <Text style={{textAlign:'center'}}>{percent}%</Text>
            </View>
        )
    }
    const _pickImage = async () => {
        try {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === 'granted') {
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.2,
                    aspect: [4, 3]
                });
                await _handleImagePicked(pickerResult);
            }
        } catch (e) {
            Sentry.captureException(e.message);
        }
    };

    const _handleImagePicked = async (pickerResult) => {
        try {
            if (!pickerResult.canceled) {
                //await uploadImageAsync(pickerResult.assets[0].uri);
                setNewProfilePicture({photoURL: pickerResult.assets[0].uri})
                setUpdateDisable(false);
                setProfilePicUpdated(true);
            }
        } catch (e) {
            Sentry.captureException(e.message);
        }
    };

   /* async function uploadImageAsync(uri) {
        const newImage = await manipulateAsync(uri, [], {
            compress: 1,
            format: SaveFormat.PNG
        })
        const img = await fetch(newImage.uri);
        const blob = await img.blob();
        const fileRef = ref(storage, `${currentUser.uid}/profilePicture`);
        const uploadTask = uploadBytesResumable(fileRef, blob);
        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setIsLoading(true)
            setPercent(progress);
        },
            (error) => Sentry.captureException(error.message),
            () => {
                setIsLoading(false)
                setUpdateDisable(false)
            }
        );
        return await getDownloadURL(fileRef);
    }*/

    // handlers for onPress TextInput style change
    const handleInputFocus = () => {
        setIsFocused(true)
    }
    const handleInputBlur = () => {
        setIsFocused(false)
    }

    const handlePrivacyPolicy = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/privacy-policy');
        setResult(result);
    };
    const handleToS = async () => {
        let result = await WebBrowser.openBrowserAsync('https://out2eat.app/terms-of-service');
        setResult(result);
    };

    async function signOut() {
        await auth.signOut()
    }

    async function deleteAccount() {
        try {
            Alert.alert(
                'Want To Delete your account',
                'Deleting your account will remove all your data from our database. Username, Email, Password, and Photos tied to your user account will be deleted!',
                [
                    {
                        text: 'Cancel',
                        onPress: () => '',
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            await deleteObject(ref(storage, `${currentUser.uid}/profilePicture`));
                            await deleteDoc(doc(firestore, 'users', currentUser.uid));
                            await auth.currentUser.delete();
                        },
                    },
                ]
            );
        } catch (e) {
            Sentry.captureException(e.message);
        }
    }

    //make me a function that uses Mailcomposer to email the support email
    /*    async function sendEmail(){
            //send email to support email
            await MailComposer.composeAsync({
              recipients: [`feedback@out2eat.app`],
                subject: 'Out2Eat Support',
                body: 'Hello Out2Eat Support Team'

            })
        }*/
    return (
        <View style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: '#fff'
        }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{
                flex: .5,
                flexDirection: "column",
                justifyContent: "center",
                padding: '10%',
                backgroundColor: '#fff'
            }}>
                <View style={{padding: 15, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={IconStyles.iconContainer} onPress={_pickImage}>
                        {isLoading ? (
                            <View style={{padding: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <UploadLoader/>
                            </View>
                        ) : (
                            <Image source={{uri: newProfilePicture.photoURL}}
                                   style={{width: 150, height: 150, borderRadius: 250}}/>
                        )}
                        <View style={ProfileStyles.editCameraContainer}>
                            <Ionicons style={IconStyles.addProfilePic} name="camera-outline"/>
                        </View>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={isFocused ? InputStyles.focusInputStyle : InputStyles.inputStyle}
                    onFocus={() => handleInputFocus(true)}
                    onBlur={() => handleInputBlur(false)}
                    value={newProfileUsername.displayName}
                    onChangeText={(text) => {
                        setNewProfileUsername({displayName: text})
                        if (currentUser.displayName !== text) {
                            setUpdateDisable(false)
                        } else {
                            setUpdateDisable(true)
                        }
                    }}
                />
                <TouchableOpacity style={updateDisable ? InputStyles.disabledUpdateButtons : InputStyles.updateButtons}
                                  disabled={updateDisable} onPress={userName}>
                    <Text style={updateDisable ? InputStyles.disabledButtonText : InputStyles.buttonText}>Update</Text>
                    <Ionicons style={updateDisable ? IconStyles.disabledEditArrowRight : IconStyles.editArrowRight}
                              name="chevron-forward-outline"/>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <View style={{
                backgroundColor: '#fff',
                width: '100%',
                flex: .5,
                flexDirection: "column",
                justifyContent: "flex-start",
                marginTop: '10%'
            }}>
                <View style={{backgroundColor: '#2e344f', padding: '4%'}}>
                    <Text style={{fontSize: 18, color: '#e4e6e9'}}>Documents</Text>
                </View>
                <View style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    paddingLeft: '4%'
                }}>
                    <TouchableOpacity onPress={handlePrivacyPolicy}
                                      style={{flexDirection: "row", paddingTop: '4%', justifyContent: "flex-start"}}>
                        <Ionicons style={{fontSize: 20, alignContent: "center"}} name="document-text-outline"/>
                        <Text style={{fontSize: 18, paddingLeft: "2%", paddingRight: "2%"}}>Privacy Policy </Text>
                        <Ionicons style={{fontSize: 16, alignSelf: "center"}} name="chevron-forward-outline"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToS}
                                      style={{flexDirection: "row", paddingTop: '4%', justifyContent: "flex-start"}}>
                        <Ionicons style={{fontSize: 20, alignContent: "center"}} name="document-text-outline"/>
                        <Text style={{fontSize: 18, paddingLeft: "2%", paddingRight: "2%"}}>Terms of Service </Text>
                        <Ionicons style={{fontSize: 16, alignSelf: "center"}} name="chevron-forward-outline"/>
                    </TouchableOpacity>

                    {/*                    <TouchableOpacity onPress={sendEmail} style = {{flexDirection:"row",paddingTop:'4%', justifyContent:"flex-start"}}>
                        <Ionicons style={{fontSize:20, alignContent:"center"}} name="bug-outline"/>
                        <Text style={{fontSize:18, paddingLeft:"2%", paddingRight:"2%"}}>Report Bugs </Text>
                        <Ionicons style={{fontSize:16, alignSelf:"center"}} name="chevron-forward-outline"/>
                    </TouchableOpacity>}*/}
                </View>
                <View style={{
                    flexDirection: "row",
                    padding: '5%',
                    alignContent: 'center',
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity onPress={signOut} style={ProfileStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="log-out-outline"/>
                        <Text style={InputStyles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteAccount} style={ProfileStyles.buttons}>
                        <Ionicons style={IconStyles.iconLeft} name="close"/>
                        <Text style={InputStyles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{
                    fontSize: 18,
                    textAlign: 'center',
                    paddingTop: '1%'
                }}>{'\u00A9'} Copyright {new Date().getFullYear()}</Text>
            </View>
        </View>
    )
}
