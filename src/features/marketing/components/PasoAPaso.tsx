/**
 * PasoAPaso (StepProgress) Component
 *
 * Customized MUI stepper for multi-step progress display.
 * Migrated from src/index/components/paso_a_paso/Paso_A_Paso.jsx
 */

import React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import type { StepIconProps } from '@mui/material/StepIcon'
import CategoryIcon from '@mui/icons-material/Category'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LoginIcon from '@mui/icons-material/Login'

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}))

interface ColorlibStepIconRootProps {
    ownerState: { completed: boolean; active: boolean }
}

const ColorlibStepIconRoot = styled('div')<ColorlibStepIconRootProps>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}))

const DEFAULT_ICONS: Record<string, React.ReactElement> = {
    1: <CategoryIcon />,
    2: <BuildCircleIcon />,
    3: <CalendarTodayIcon />,
    4: <LoginIcon />,
}

function ColorlibStepIcon(props: StepIconProps): React.ReactElement {
    const { active, completed, className, icon } = props

    return (
        <ColorlibStepIconRoot ownerState={{ completed: !!completed, active: !!active }} className={className}>
            {DEFAULT_ICONS[String(icon)] || icon}
        </ColorlibStepIconRoot>
    )
}

export interface PasoAPasoProps {
    /** Current active step (0-indexed) */
    activeStep: number
    /** Array of step labels */
    steps: string[]
    /** Custom step icons mapping */
    icons?: Record<string, React.ReactElement>
}

export function PasoAPaso({
    activeStep,
    steps,
}: PasoAPasoProps): React.ReactElement {
    return (
        <Stack
            sx={{ width: '100%', pt: 2, pb: 2 }}
            spacing={4}
            className="paso-a-paso opacidad-stepper"
        >
            <Stepper
                alternativeLabel
                activeStep={activeStep}
                connector={<ColorlibConnector />}
                style={{ overflowX: 'scroll', width: '100%' }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    )
}

export default PasoAPaso
