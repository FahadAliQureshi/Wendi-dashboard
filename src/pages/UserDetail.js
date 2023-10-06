import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TailSpin } from 'react-loader-spinner'
import {
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  TextField,
  Grid,
  Paper,
  Box,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import man from '../assets/man.avif';
import { useGetUserByIdQuery, useSetUserByIdMutation } from '../redux/userManagement/userManagementApi';
import { prepareSetUserDetailsData } from './utils';

const StyledCard = styled(Card)({
  width: '100%', // Set the width to 100% to match the parent Container
  margin: '0 auto',
  padding: (theme) => theme.spacing(2),
});

const StyledButton = styled(Button)({
  fontSize: '15px',
  marginTop: (theme) => theme.spacing(2),
});

const UserDetail = ({ user }) => {
  const [setUserDetails] = useSetUserByIdMutation();
  const { _id } = useParams();
  const { data: specificUser, isFetching, refetch } = useGetUserByIdQuery({ _id });
  const [image, setImage] = useState(null);
  // const [imageURI, setImageURI] = useState('');
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  // const [editedUser, setEditedUser] = useState({ ...user });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    fullName: '',
    gender: '',
    sexualOrientation: '',
    // email: specificUser?.data?.email || '',
    aboutYou: '',
    // password: specificUser?.data?.password || '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  console.log('Source===', selectedImage);

  useEffect(() => {
    // if (editedUser.fullName || editedUser.gender || editedUser.sexualOrientation || editedUser.aboutYou) {
    //   <ColorRing
    //     visible={true}
    //     height="80"
    //     width="80"
    //     ariaLabel="blocks-loading"
    //     wrapperStyle={{}}
    //     wrapperClass="blocks-wrapper"
    //     colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
    //   />;
    // } elseU
      setEditedUser({
        fullName: specificUser?.data?.fullName,
        gender: specificUser?.data?.gender,
        sexualOrientation: specificUser?.data?.sexualOrientation,
        // email: specificUser?.data?.email,
        aboutYou: specificUser?.data?.aboutYou,
        // password: specificUser?.data?.password,
      });
  }, [specificUser]);

  const [userArray, setUserArray] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => {
      // Check if the new value is different from the current value
      if (prevUser[name] !== value) {
        return {
          ...prevUser,
          [name]: value,
        };
      }
      return prevUser; // No change needed
    });
    // console.log("editedUser=====",editedUser)
  };

  // const handleSave = async () => {
  //   setUserArray((prevArray) => [...prevArray, editedUser]);
  //   try {
  //     const response = await setUserDetails({ _id, ...editedUser });
  //     console.log('User details updated successfully', response);
  //     setEdit(false);
  //     setEditedUser({
  //       username: '',
  //       gender: '',
  //       sexualOrientation: '',
  //       email: '',
  //       aboutYou: '',
  //       password: '',
  //     });
  //     console.log("editedUser=====", editedUser);
  //   } catch (error) {
  //     console.error('Error updating user details', error);

  //   }
  //   console.log("edited userttt", editedUser)
  //   const res =  setUserDetails(editedUser)
  // };

  const handleSave = async () => {
    if (
      editedUser.fullName === '' ||
      editedUser.gender === '' ||
      editedUser.sexualOrientation === '' ||
      editedUser.aboutYou === ''
    ) {
      toast.error('Please enter the credentials', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } else {
      setLoading(true);
      try {
        const preparedData = prepareSetUserDetailsData(editedUser, selectedImage);
        const response = await setUserDetails({ preparedData, _id });
        if (response?.data?.status === 200) {
          refetch();
          setLoading(false);
          // setImageURI(response.data.uri);
        }
        console.log('ideeeeeee', _id);
        console.log('user details going to the api', response);

        // const response = await setUserDetails({ payload: editedUser }, _id);
        setEdit(false);
        if (setUserDetails.isSuccess) {
          toast.success('User details updated successfully');
          console.log('User details updated successfully', response);

          setEditedUser({
            fullName: '',
            gender: '',
            sexualOrientation: '',
            // email: '',
            aboutYou: '',
            // password: '',
          });
          // Successful response handling

          // Fahad commented
          // const data = response.data;
          // showMessage({
          //   type: 'success',
          //   message: 'עודכן בהצלחה',
          // });
          //

          // Handle further actions if needed
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // You can also add validation here for the file type and size if needed
      const myURI = URL.createObjectURL(e.target.files[0]);
      console.log('OKOKO =======', file);
      setSelectedImage(file);
      // const reader = new FileReader();

      // reader.onloadend = () => {
      //   setSelectedImage(reader.result);
      // };

      // reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log('imageee', image);
  }, [image]);



    const myImg = `http://192.168.18.131:3333/Images/${specificUser?.data?.profileImages?.find((item) => item?.orderId === 1)
    ?.uri?.split('/')
      ?.pop()}`
  console.log('editttttt', myImg);

  return loading ? (
    <TailSpin color="red" radius={'8px'} />
  ) : (
    <Container component="main" maxWidth="lg" sx={{ width: '100%' }}>
      <StyledCard sx={{ width: '95%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, width: '200px', height: '200px' }}>
             <img
             alt=""
        src={myImg}
        style={{height:"100%",width:"100%",objectFit:"cover"}}
             />
                {/* <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%' }} /> */}
                {/* <Typography variant="subtitle1">
                  Profile Picture: {editedUser.pic}
                </Typography> */}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Username:</Typography>
                <Typography variant="body1">{specificUser?.data?.fullName}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Gender:</Typography>
                <Typography variant="body1">{specificUser?.data?.gender}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Sexual Orientation:</Typography>
                <Typography variant="body1">{specificUser?.data?.sexualOrientation}</Typography>
              </Paper>
            </Grid>
            {/* <Grid item xs={6}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography variant="body1">{specificUser?.data?.email} </Typography>
              </Paper>
            </Grid> */}
            <Grid item xs={6}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Bio:</Typography>
                <Typography variant="body1">{specificUser?.data?.aboutYou}</Typography>
              </Paper>
            </Grid>
            {/* <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, display: 'flex', gap: '2px' }}>
                <Typography variant="subtitle1">Password:</Typography>
                <Typography variant="body1">dontAsk {editedUser.password}</Typography>
              </Paper>
            </Grid> */}
          </Grid>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              navigate('/dashboard/user');
            }}
            sx={{ margin: '20px 10px 0px 0px', background: '#4A276B' }}
          >
            Back
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              // handleSave();
              setEdit(true);
            }}
            sx={{ margin: '20px 10px 0px 0px', background: '#4A276B' }}
          >
            Edit
          </StyledButton>

          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              // handleSave();
            }}
            sx={{ margin: '20px 10px 0px 0px', background: '#4A276B' }}
          >
            Delete User
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              // handleSave();
            }}
            sx={{ margin: '20px 10px 0px 0px', background: '#4A276B' }}
          >
            Suspend User
          </StyledButton>

          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => {
              navigate(`/userpayment/${_id}`);
              // navigate('/userpayment');
            }}
            sx={{ margin: '20px 10px 0px 0px', background: '#4A276B' }}
          >
            Payment Details
          </StyledButton>
        </CardContent>
      </StyledCard>
      {edit && (
        <Container component="main" maxWidth="lg" sx={{ width: '100%', marginTop: '50px' }}>
          <StyledCard sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Edit Details
              </Typography>
              <Button variant="outlined" component="label" htmlFor="image-input">
                Upload Image
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </Button>
              <TextField
                label="Username"
                name="fullName"
                value={editedUser.fullName}
                disabled={!edit}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />

              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                name="gender"
                value={editedUser.gender}
                // value={specificUser?.data?.gender}
                disabled={!edit}
                onChange={handleInputChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>

              <TextField
                label="Sexual Orientation"
                name="sexualOrientation"
                value={editedUser.sexualOrientation}
                // value={specificUser?.data?.sexualOrientation}
                disabled={!edit}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              {/* <TextField label="Email" 
              name = "email"
              value={editedUser.email}
              // disabled={!edit}
               fullWidth margin="normal"  
                onChange = {handleInputChange}/> */}
              <TextField
                label="Bio"
                name="aboutYou"
                value={editedUser.aboutYou}
                disabled={!edit}
                fullWidth
                margin="normal"
                onChange={handleInputChange}
              />
              {/* <TextField label="New password" 
              name = "password"
              value = {editedUser.password}
              disabled={!edit}
               fullWidth margin="normal"  
                onChange = {handleInputChange}/> */}
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => {
                  handleSave();
                  // setEdit(false);
                }}
                sx={{ margin: '10px 10px 0px 0px', background: '#4A276B' }}
              >
                Save Changes
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => {
                  // handleSave();
                  setEdit(false);
                }}
                sx={{ margin: '10px 10px 0px 0px', background: '#4A276B' }}
              >
                Cancel
              </StyledButton>
            </CardContent>
          </StyledCard>
        </Container>
      )}
    </Container>
  );
};

export default UserDetail;
