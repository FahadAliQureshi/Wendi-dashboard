import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { faker } from '@faker-js/faker';
import React, { useRef, useState, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { useSuccess } from '../SuccessContext';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'report', label: 'Report:', alignRight: false, width:"100%" },
//   { id: 'email', label: 'Email', alignRight: false },
  // { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
//   { id: 'status', label: 'Status', alignRight: false },
  // { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Reports() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isSuccessMessageShown, setSuccessMessageShown] = useState(false);

  const [showUserDetails, setShowUserDetails] = useState(false)

 // tostify
 const { showSuccess, setShowSuccess } = useSuccess();
const [reports, setReports] = useState([
  { name: "Monthly" },
  { name: "Weekly" },
  { name: "Annually" },
  { name: "Annually" },
  { name: "Annually" },
]);

  
  // Existing state variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For previewing selected image
  const fileInputRef = useRef(null);
  const [uploadTrue, setUploadTrue] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const anchorRef = useRef(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  // Function to handle the selected file
  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    console.log('selected============', selected);
    setSelectedFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        console.log('cted============', previewUrl);
        setUploadTrue(true);
      };
      reader.readAsDataURL(selected);
    }
  };

  // Function to upload the profile picture
  const handleUpload = () => {
    if (selectedFile) {
      // Placeholder for API upload logic
      console.log('Uploading:', selectedFile);
      // Reset selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadTrue(true);
    }
  };

  useEffect(() => {
    if (showSuccess) {
        toast.success('Form submitted successfully!', {
            autoClose: 3000,
        });
    }
}, [isSuccessMessageShown]);
  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
        </Stack>

        <Card> 
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>

          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Filter Reports..."/>
          <Button variant="contained" sx={{ background: '#4A276B',  height: "50px", marginRight:"20px"}}
          onClick={()=>{
            // navigate('/reports');
          }} 
          >
            Export
          </Button>
          </div>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { id, name, fakeReportTitle ,role, status, email, avatarUrl, isVerified,type } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="none" selected={selectedUser}
                      sx={{cursor: "pointer"}}
                      onClick = {()=>{
                        // setShowUserDetails(true);
                        // navigate('/userdetails')
                      }} 
                      >
                    

                        <TableCell padding="checkbox"
                        onClick={(e)=>{
                          e.stopPropagation()
                        }}
                        
                        >
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="0px 0px 0px 40px">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar
                              sx={{ cursor: 'pointer' }}
                              alt={name}
                              src={avatarUrl}
                       
                            /> */}

                            {/* Hidden file input */}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleFileChange} // Handle file selection
                              ref={fileInputRef}
                            />

                            <Typography variant="subtitle2" noWrap>
                                {/* {fakeReportTitle}
                                {faker.lorem.words()} */}
                                {/* {reports[index].name} */}
                                {/* {reports?.map((item,index)=>{
                                  return(
                                    <div>
                                      {item.name}
                                    </div>
                                  )
                                })} */}
                             {index === 0 ? 
                             "Annual" :  
                             index ===1 ? 
                            "Monthly":
                            index ===2 ? 

                            "Weekly":
                            index ===3 ? 
                            "Daily":
                            "Hourly"
                            } Report
                              {/* {name} */}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* <TableCell align="left">{email}</TableCell> */}

                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} ref={anchorRef}/>
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Button variant="contained" sx={{ background: '#4A276B',  margin:"30px 0px 30px 50px"}}
          onClick={()=>{
            navigate('/dashboard/reportandanalytics');
            // navigate(-1); 
          }}
          >
            Back to Report and analytics
          </Button>
      <ToastContainer />
    </>
  );
}
