import React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': { width: 18 },
    '& .MuiSwitch-switchBase.Mui-checked': { transform: 'translateX(12px)' },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#1890ff',
        ...theme.applyStyles?.('dark', { backgroundColor: '#177ddc' }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    borderRadius: 8,
    transition: theme.transitions.create?.(['width'], { duration: 200 }) || 'all 0.2s',
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.applyStyles?.('dark', { backgroundColor: 'rgba(255,255,255,.35)' }),
  },
}));

/**
 * Props:
 * - roleIndex: 0=studente, 1=docente
 * - onToggle: (e) => void
 */
export default function RoleSwitch({ roleIndex, onToggle }) {
  return (
    <FormGroup>
      <Stack justifyContent="center" direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography component="span">Studente</Typography>
        <AntSwitch
          checked={roleIndex === 1}
          onChange={onToggle}
          inputProps={{ 'aria-label': 'Selettore ruolo (Studente/Docente)' }}
        />
        <Typography component="span">Docente</Typography>
      </Stack>
      <div className="role-chip" aria-live="polite">
        {roleIndex === 1 ? 'Accesso Docente' : 'Accesso Studente'}
      </div>
    </FormGroup>
  );
}
