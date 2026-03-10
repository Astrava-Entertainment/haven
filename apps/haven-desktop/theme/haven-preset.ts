import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export default definePreset(Aura, {
  primitive: {
    green: {
      25: '#F9FAF5',
      50: '#F3F8EA',
      100: '#E2ECCB',
      200: '#CEE0AA',
      300: '#BBD389',
      400: '#ADCA6F',
      500: '#9FC157',
      600: '#8BAF46',
      700: '#779140',
      800: '#5F7334',
      900: '#3D521D'
    },
    brown: {
      25: '#FFFEFA',
      50: '#F7F4E6',
      100: '#EBE5D5',
      200: '#D9CCAB',
      300: '#C6B384',
      400: '#B3985F',
      500: '#A0843C',
      600: '#806930',
      700: '#604F24',
      800: '#403418',
      900: '#1C1913'
    }
  },
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#fffefa',
          50: '{brown.25}',
          100: '{brown.50}',
          200: '{brown.100}',
          300: '{brown.200}',
          400: '{brown.300}',
          500: '{brown.400}',
          600: '{brown.500}',
          700: '{brown.600}',
          800: '{brown.700}',
          900: '{brown.800}'
        },
        text: {
          color: '{brown.900}',
          secondaryColor: '{brown.700}',
          mutedColor: '{brown.600}'
        }
      },
      dark: {
        surface: {
          0: '#1c1913',
          50: '#241f18',
          100: '#2d271f',
          200: '#403418',
          300: '#604f24',
          400: '#806930',
          500: '#a0843c',
          600: '#b3985f',
          700: '#c6b384',
          800: '#d9ccab',
          900: '#ebe5d5'
        },
        text: {
          color: '{brown.50}',
          secondaryColor: '{brown.200}',
          mutedColor: '{brown.300}'
        }
      }
    }
  }
});
