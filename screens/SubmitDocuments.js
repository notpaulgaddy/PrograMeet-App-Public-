import React from 'react';
import {StyleSheet,Text,SafeAreaView,Card,TouchableOpacity,View} from "react-native";
import AppContext from "../store/AppContext";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCollection } from "react-firebase-hooks/firestore";
import { FontAwesome } from "@expo/vector-icons";

const submitDocuments = () => {

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.firstText}>We need to verify your information. This will help us make sure this app stays for high school students as intended, thank you.</Text>
            <Card style={styles.bgBox}>
                <View style={styles.imageDiv}>
                    <FontAwesome name="file-invoice" size={20} color="#2660FF"/>
                </View>
                <View style={styles.mainBox}>
                    <Text style={styles.topText}>
                        Step One
                    </Text>
                    <Text style={styles.bottomText}>
                        Document of Choice
                    </Text>
                </View>
            </Card>
            <Card style={styles.bgBox}>
                <View>
                    <FontAwesome name="file-invoice" size={20} color="#2660FF"/>
                </View>
                <View style={styles.mainBox}>
                    <Text style={styles.topText}>
                        Step Two
                    </Text>
                    <Text style={styles.bottomText}>
                        Take a Selfie
                    </Text>
                </View>
            </Card>
            <TouchableOpacity style={styles.nextBtn}>
                Start
                {/* Then go to document screen */}
            </TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingBottom: StatusBar.currentHeight,
        backgroundColor: MAGENTA,
      },
    imageDiv: {
        marginLeft:"7%",
    },
    firstText: {
        fontSize: 21,
        marginTop:"20%",
        width:"80%"
    },
    bgBox:{
        backgroundColor:"white",
        height:"100px"
    },
    mainBox: {
        marginTop:"30%",
    },
    topText:{
        fontSize:14,
    },
    bottomText:{
        fontSize:16,
        fontWeight:"bold",
    },
    nextBtn:{
        backgroundColor:"#2660FF",
        color:"white",
    }
});