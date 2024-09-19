import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import LoaderView from './LoaderView';
import { RootState } from '../../store/reducers';

const LoaderController = () => {
    const {loading} = useSelector((state: RootState) => ({
        loading: state?.loader?.loading
    }));


    // const loading1 = useSelector((state => state?.laoder?.loading))

    console.log('laoding', loading)

    return (
       <LoaderView loading={loading}/>
    );
}

export default LoaderController

const styles = StyleSheet.create({})