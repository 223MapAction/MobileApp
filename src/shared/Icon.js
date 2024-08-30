import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';


export default ({focused,name,color,...rest})=>{
    let iconName = name;
    if(focused){
        iconName = name
    }
    return <Icon testID="icon" focused={focused} name={iconName} size={24} style={{color}} {...rest}/>
}