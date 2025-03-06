import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Divider,
  SelectChangeEvent
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Sample data
const subscriptions = [
  { id: 'sub-1', name: 'Development Subscription' },
  { id: 'sub-2', name: 'Production Subscription' }
];

const vnets = [
  { id: 'vnet-1', name: 'vnet-eastus' },
  { id: 'vnet-2', name: 'vnet-westus' },
  { id: 'vnet-3', name: 'vnet-central' }
];

const storageAccounts = [
  { id: 'sa-1', name: 'flowlogsstorage01' },
  { id: 'sa-2', name: 'diagstorage02' }
];

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    onboardingType: 'subscription',
    subscriptionId: '',
    tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    appName: 'IllumioIntegration',
    enableFlowLogs: true,
    selectedVNets: [] as string[],
    selectedStorageAccounts: [] as string[]
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
  };

  const OnboardingStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Illumio Onboarding
      </Typography>
      
      <FormControl component="fieldset" sx={{ mt: 2 }}>
        <FormLabel component="legend">Onboarding Type</FormLabel>
        <RadioGroup
          value={formData.onboardingType}
          onChange={(e) => handleInputChange('onboardingType', e.target.value)}
        >
          <FormControlLabel value="subscription" control={<Radio />} label="Subscription" />
          <FormControlLabel value="tenant" control={<Radio />} label="Tenant" />
        </RadioGroup>
      </FormControl>

      {formData.onboardingType === 'subscription' && (
        <FormControl fullWidth sx={{ mt: 3 }}>
          <FormLabel>Select Subscription</FormLabel>
          <Select
            value={formData.subscriptionId}
            onChange={(e: SelectChangeEvent) => handleInputChange('subscriptionId', e.target.value)}
            sx={{ mt: 1 }}
          >
            <MenuItem value="">Select a subscription</MenuItem>
            {subscriptions.map((sub) => (
              <MenuItem key={sub.id} value={sub.id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {formData.onboardingType === 'tenant' && (
        <FormControl fullWidth sx={{ mt: 3 }}>
          <FormLabel>Tenant ID</FormLabel>
          <TextField
            value={formData.tenantId}
            onChange={(e) => handleInputChange('tenantId', e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            helperText="Your Azure AD tenant ID"
          />
        </FormControl>
      )}

      <FormControl fullWidth sx={{ mt: 3 }}>
        <FormLabel>App Registration Name</FormLabel>
        <TextField
          value={formData.appName}
          onChange={(e) => handleInputChange('appName', e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
          helperText="Name for the Entra ID application used for SSO integration"
        />
      </FormControl>
    </Box>
  );

  const NetworkSettingsStep = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Network Settings
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.enableFlowLogs}
            onChange={(e) => handleInputChange('enableFlowLogs', e.target.checked)}
          />
        }
        label="Enable Flow Logs"
        sx={{ mt: 2 }}
      />

      {formData.enableFlowLogs && (
        <Box sx={{ mt: 3 }}>
          <FormLabel>Select VNets for Flow Logs</FormLabel>
          <Paper variant="outlined" sx={{ mt: 1 }}>
            {vnets.map((vnet) => (
              <Box key={vnet.id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.selectedVNets.includes(vnet.id)}
                      onChange={(e) => {
                        const updatedVNets = e.target.checked
                          ? [...formData.selectedVNets, vnet.id]
                          : formData.selectedVNets.filter(id => id !== vnet.id);
                        handleInputChange('selectedVNets', updatedVNets);
                      }}
                    />
                  }
                  label={vnet.name}
                />
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <FormLabel>Select Storage Accounts</FormLabel>
        <Paper variant="outlined" sx={{ mt: 1 }}>
          {storageAccounts.map((storage) => (
            <Box key={storage.id} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.selectedStorageAccounts.includes(storage.id)}
                    onChange={(e) => {
                      const updatedStorage = e.target.checked
                        ? [...formData.selectedStorageAccounts, storage.id]
                        : formData.selectedStorageAccounts.filter(id => id !== storage.id);
                      handleInputChange('selectedStorageAccounts', updatedStorage);
                    }}
                  />
                }
                label={storage.name}
              />
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );

  const steps = [
    { label: 'Illumio Onboarding', component: OnboardingStep },
    { label: 'Network Settings', component: NetworkSettingsStep }
  ];

  const CurrentStepComponent = steps[activeStep].component;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Illumio Cloud Secure Integration
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 3 }}>
              <Typography variant="h5">
                Illumio Cloud Secure Integration
              </Typography>
            </Box>
            
            <Stepper activeStep={activeStep} sx={{ p: 3 }}>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Divider />
            
            <form onSubmit={handleSubmit}>
              <CurrentStepComponent />
              
              <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Previous
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    color="primary"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
