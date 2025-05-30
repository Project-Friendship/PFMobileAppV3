import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';


import colors from '../../assets/colors/colors'



export default function TimeEntry() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.flexContainer}>
      <StatusBar backgroundColor={colors.light_blue} />
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerText}>Time Spent with Mentee</Text>
      </SafeAreaView>

      <SafeAreaView style={styles.safeAreaContent}>
        {/* <View style={styles.calendarContainer}>

        </View> */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Enter Time Manually</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <EntryForm setModalVisible={setModalVisible} modalVisible={modalVisible}></EntryForm>

    </View>
  );
}

interface EntryFormProps {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    modalVisible: boolean,
}

const EntryForm = ({setModalVisible, modalVisible}: EntryFormProps) =>{
    const [inputValue, setInputValue] = useState('');
    const [date, setDate] = useState(new Date());

    const onChangeDate = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };

    const onChangeStartTime = (event: any, selectedTime: Date | undefined) => {
      const currentTime = selectedTime || startTime;
      setStartTime(currentTime);
  };

  const onChangeEndTime = (event: any, selectedTime: Date | undefined) => {
      const currentTime = selectedTime || endTime;
      setEndTime(currentTime);
  };

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
      {label: 'The Hideaway', value: 'The Hideaway'},
      {label: 'Northfield School Activities', value: 'Northfield School Activities'},
      {label: 'Dundas Dome', value: 'Dundas Dome'},
      {label: 'Cannon Valley Maker Space', value: 'Cannon Valley Maker Space'},
      {label: 'Farmstead Bike Shop', value: 'Farmstead Bike Shop'},
      {label: 'Tin Tea', value: 'Tin Tea'},
      {label: "Han's Kitchen", value: "Han's Kitchen"},
      {label: 'James Gang Coffeehouse', value: 'James Gang Coffeehouse'},
      {label: "Flaherty's Northfield Lanes", value: "Flaherty's Northfield Lanes"},
      {label: 'Cannon Valley Cinema 10', value: 'Cannon Valley Cinema 10'},
      {label: 'Northfield Arts Guild', value: 'Northfield Arts Guild'},
      {label: 'Northfield Yarn', value: 'Northfield Yarn'},
      {label: 'Nautical Bowls', value: 'Nautical Bowls'},
      {label: "Robin's Egg Bakery", value: "Robin's Egg Bakery"},
      {label: 'Good Bye Blue Monday', value: 'Good Bye Blue Monday'},
      {label: 'Fairfield Inn and Suites', value: 'Fairfield Inn and Suites'},
      {label: 'Northfield History Center', value: 'Northfield History Center'},
      {label: 'The Goat', value: 'The Goat'},
      {label: 'Games & Geek', value: 'Games & Geek'},
      {label: 'Cake Walk', value: 'Cake Walk'},
      {label: 'The Blast', value: 'The Blast'}
    ]);

    const [meetupData, setMeetupData] = useState({
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      durationHours: 0,
      description: '',
      communityPartners: ['']
    })

    const handleSubmit = () => {
      // build dict

      const finalStartTime = new Date(startTime.getTime()); 
      const finalEndTime = new Date(endTime.getTime());    

      // Set the date components of the cloned time variables to match the 'date' state.
      finalStartTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      finalEndTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      
      const startMillis = startTime.getTime();
      const endMillis = endTime.getTime();
      const durationMillis = endMillis - startMillis; 



      setMeetupData({
        date: date,
        startTime: finalStartTime,
        endTime: finalEndTime,
        durationHours: Number((durationMillis / (1000 * 60 * 60)).toFixed(2)),
        description: inputValue,
        communityPartners: value,
      })

      // reset values  
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());    
      setValue([])
      setInputValue(''); 
      // hide modal
      setModalVisible(!modalVisible);
    }

    useEffect(() => {
      console.log('meetupData was updated:', meetupData);
      // submit request to database
      // update currently displayed times in calendar
     
    }, [meetupData]);
  



    return(
        
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter Meetup Information</Text>
          
          
          <View style={styles.modalRows}>
            <Text style={styles.modalText}>Date:</Text>
            <DateTimePicker 
              mode='date' 
              display='default'
              value={date}
              onChange={onChangeDate}
              />
          </View>  
          <View style={styles.modalRows}>
            <Text style={styles.modalText}>Start Time:</Text>

            <DateTimePicker 
              mode='time' 
              display='default'
              value={startTime}
              onChange={onChangeStartTime}
              />
          </View>  

          <View style={styles.modalRows}>
            <Text style={styles.modalText}>End Time:</Text>
            <DateTimePicker 
              mode='time' 
              display='default'
              value={endTime}
              onChange={onChangeEndTime}
              />
          </View>  

          <Text style={styles.modalText}>Brief Meetup Description:</Text>

          <TextInput
            style={styles.input}
            onChangeText={setInputValue}
            value={inputValue}
            placeholder="Type here..."
            placeholderTextColor="#999" 
          />       

          <Text style={styles.modalText}>Community Partners Visited:</Text>
          <DropDownPicker
                open={open}
                multiple={true}
                min={0}
                max={10}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={styles.selectorContainer}
                mode="BADGE"
                placeholder='Select any community partners'

                placeholderStyle={{
                  color: "#999",
                }}
                dropDownContainerStyle={styles.selectorContainer}
                // theme='LIGHT'
              />


          

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonTextStyle}>Submit & Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => {
                setModalVisible(!modalVisible);
                setDate(new Date());
                setStartTime(new Date());
                setEndTime(new Date());    
                setValue([])
                setInputValue(''); 
              }}
            >
              <Text style={styles.buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
    )
}





export const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  header: {
    height: 80, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light_blue,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  safeAreaContent: {
    flex: 1,
    backgroundColor: "#ffffff", 

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,

  },
  calendarContainer :{
    backgroundColor: "#c1dadf",
    flex: 1,    
    paddingHorizontal: 20,

  },
  button: {
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    marginHorizontal:3,
    borderRadius: 28,
    width: '50%',
    alignItems: 'center',
    marginVertical: 10, 
    backgroundColor: colors.orange,
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  modalView: {
    width: '85%', 
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15, 
    padding: 25, 
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20, 
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalRows: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  modalText: {
    textAlign: 'left',
  },
  input: {
    height: 45, 
    width: '100%', 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd', 
    padding: 10,
    borderRadius: 8, 
    backgroundColor: '#f9f9f9', 
  },
  selectorContainer: {
    backgroundColor: '#f9f9f9', 
    borderColor: '#ddd', 
  }, 
  buttonClose: {
    backgroundColor: '#00aae9', 
  },
  buttonCancel: {
    backgroundColor: '#e74c3c', 
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});