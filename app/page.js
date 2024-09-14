"use client"
import { Box, Stack, Typography, Button, Modal, TextField, IconButton } from '@mui/material'
import { firestore } from '@/firebase'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import './globals.css'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function Home() {

  const[showMessage, setShowMessage] = useState(true)

  const [pantry, setPantry] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    gap: 3,
  };

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
      await updatePantry()
      return 
    }
    else{
      await setDoc(docRef, {count: 1})
    }
    updatePantry()

  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {count} = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {count: count -1})
      }
    }
    await updatePantry()
  }

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={2}>
        
      {showMessage && (
        <Box className={`welcome-message ${showMessage ? 'slide-down' : ''}`}
             style={{ position: 'fixed', top: 0, left: 0, width: '100%', textAlign: 'center',  }}>
         <Typography fontFamily ='Oswald, Arial, sans-serif' variant = "h1">Welcome to the Pantry Tracker!</Typography>
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="addItemBox" borderRadius="16px" sx={style}>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Add Item"
              variant="outlined"
              color = "warning"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <IconButton variant="contained" 
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            ><AddCircleIcon className = "addIconButton" fontSize="large"/>
            </IconButton>
          </Stack>
        </Box>
      </Modal>
      <Button className = "addButton" variant="contained" onClick={handleOpen}>
        ADD ITEM</Button>
      <Box  borderRadius= '16px' boxShadow={9}>
        <Box className = "pantryBox"
        borderRadius = {'16px'}
        width={"800px"}
          height={"100px"}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}>
          <Typography fontWeight = 'light' fontFamily ='Oswald, Arial, sans-serif' variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack
        sx={{
          width:"800px",
          height:"200px",
          overflowY:'auto',
        }}
          >
          {pantry.map(({name, count}) => (

            <Box
              key={name}
              width={"100%"}
              minHeight={"100px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              paddingX={2}
            >
              <Typography
                variant={'h4'}
                color={'#333'}
                textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant={'h5'}
                color={'#333'}
                textAlign={'center'}>
                  Quantity: {count}
                </Typography>
              <IconButton  onClick={() => removeItem(name)}> <RemoveCircleIcon className = "addIconButton" fontSize="large" /></IconButton>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}