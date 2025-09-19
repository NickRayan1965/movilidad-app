async function createReservation(data){
  return await postData('/reservations', data);
}

async function deleteReservationById(id){
  return await deleteData('/reservations/'.concat(id));
}

async function updateReservation(data){
  return await putData('/reservations', data);
}