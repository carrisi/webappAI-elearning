import React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

// Styled AntSwitch come prima
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': { width: 15 },
    '& .MuiSwitch-switchBase.Mui-checked': { transform: 'translateX(9px)' },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
        ...theme.applyStyles('dark', { backgroundColor: '#177ddc' }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], { duration: 200 }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 8,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.applyStyles('dark', { backgroundColor: 'rgba(255,255,255,.35)' }),
  },
}));

/**
 * Props:
 * - roleIndex: numero (0=studente, 1=docente)
 * - onToggle: funzione (e => void) per aggiornare il roleIndex
 */
export default function RoleSwitch({ roleIndex, onToggle }) {
  return (
    <FormGroup>
        <Stack justifyContent={'center'} direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography>Studente</Typography>
        <AntSwitch
          checked={roleIndex === 1}
          onChange={onToggle}
          inputProps={{ 'aria-label': 'Selettore ruolo' }}
        />
        <Typography>Docente</Typography>
      </Stack>
    </FormGroup>
  );
}
