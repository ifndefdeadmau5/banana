import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

const Root = styled.div({
  padding: '1em',
});

const GET_LIST = gql`
  query GetList {
    getList
  }
`;

const GET_URL = gql`
  query GetUrl($filename: String) {
    getUrl(filename: $filename)
  }
`;

export default () => {
  const { data: urlData } = useQuery(GET_URL, {
    fetchPolicy: 'network-only',
    variables: {
      filename: 'Sungmin Park _wanted_resume 2019-08-28 11.39.46 (1).pdf',
    },
  });
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = async () => {
      const binaryStr = reader.result;
    };

    acceptedFiles.forEach((file: any) => reader.readAsBinaryString(file));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { loading, error, data = {} } = useQuery(GET_LIST, {
    fetchPolicy: 'network-only',
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <List>
        {data.getList &&
          data.getList.map(v => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={v.Key} secondary={v.Size} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Root>
  );
};
