import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ModelFileProps } from '../types/ModelFileProps';

/**
 * Is a hook that will decide which loader to use for a File
 * The value from this should be directly put into a primitive as : object={here}
 * @param file
 * @returns model
 */
export function useModelFromFile(file: ModelFileProps) {
  const loader = /\.(obj)$/i.test(file.name) ? OBJLoader : FBXLoader;

  const model = useLoader(loader, file.bin, (loaderInstance) => {
    loaderInstance.manager.onError = (url) => {
      console.error('Error loading model from', url);
    };
  });

  return model;
}
