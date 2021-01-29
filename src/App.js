/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import cellEditFactory from 'react-bootstrap-table2-editor';
import BootstrapTable from 'react-bootstrap-table-next';

import api from './api/index';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import { RiDeleteBin6Fill } from 'react-icons/ri';

function App() {
  const { register, handleSubmit, errors } = useForm();
  const [items, setItems] = useState([]);
  const [uf, setUf] = useState([]);
  const [cities, setCities] = useState([]);
  const [addresses, setAddress] = useState(
    JSON.parse(localStorage.getItem('adressess')) || []
  );

  // submit
  const onSubmit = (data, e) => {
    const ufi = items.find((item) => item.id === parseInt(data.uf));
    const list = addresses;
    data.id = Math.floor(Math.random() * 100);
    data.ufn = ufi.sigla;
    data.default_shipping = data.default_shipping === true ? 'Sim' : 'Não';
    data.billing_address = data.billing_address === true ? 'Sim' : 'Não';
    list.push(data);
    setAddress(list);
    localStorage.setItem('adressess', JSON.stringify(list));
    e.target.reset();
    setCities([]);
  };

  //get UF
  useEffect(() => {
    async function getUf() {
      const { data } = await api.get('localidades/estados');
      setItems(data);
    }
    getUf();
  }, []);

  //get cities
  useEffect(() => {
    async function getCities() {
      const { data } = await api.get(
        'localidades/estados/' + uf + '/distritos'
      );
      setCities(data);
    }
    getCities();
  }, [uf]);

  //delete address
  function handleDelete(id) {
    const r = window.confirm('Do you really want to delete?') ? true : false;
    if (r === true) {
      const listd = JSON.parse(localStorage.getItem('adressess'));
      const result = listd.filter((item) => item.id !== id);
      setAddress(result);
      localStorage.clear();
      localStorage.setItem('adressess', JSON.stringify(result));
    }
  }

  const buttonDelete = (id) => {
    return (
      <button
        style={{ backgroundColor: 'transparent', margin: 'auto' }}
        className="border-0"
        onClick={() => handleDelete(id)}
      >
        <RiDeleteBin6Fill style={{ backgroundColor: 'transparent' }} />
      </button>
    );
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
    },
    {
      dataField: 'address',
      text: 'Address',
    },
    {
      dataField: 'city',
      text: 'City',
      sort: true,
    },
    {
      dataField: 'ufn',
      text: 'UF',
    },
    {
      dataField: 'zipcode',
      text: 'Zip Code',
    },
    {
      dataField: 'default_shipping',
      text: 'D S',
    },
    {
      dataField: 'billing_address',
      text: 'B A',
    },
    {
      dataField: 'id',
      text: 'Actions',
      classes: 'text-center',
      formatter: (id) => buttonDelete(id),
    },
  ];

  return (
    <div className="App container">
      <h4 className="d-block text-white text-left">
        Gerenciamento de endereços
      </h4>
      <div className="row">
        <div className="col-8">
          <BootstrapTable
            keyField="id"
            data={addresses}
            columns={columns}
            striped
            hover
            condensed
            bootstrap4
            classes="bg-white"
            cellEdit={cellEditFactory({
              mode: 'click',
              blurToSave: true,
              afterSaveCell: (oldValue, newValue, row) => {
                //console.log(row.id);
                let list = addresses;
                list.filter((item) => item.id !== row.id).push(row);
                setAddress(list);
                localStorage.setItem('adressess', JSON.stringify(list));
              },
            })}
          />
        </div>
        <div className="col bg-light p-4">
          <form name="frmAddContact" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Name:</label>
              <input
                name="name"
                className="form-control"
                ref={register({ required: true, maxLength: 30 })}
                placeholder="Name"
              />
              {errors.name && errors.name.type === 'required' && (
                <span role="alert">This is required</span>
              )}
              {errors.name && errors.name.type === 'maxLength' && (
                <span role="alert">Max length exceeded</span>
              )}
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                name="address"
                className="form-control"
                ref={register({ required: true, maxLength: 80 })}
                placeholder="Address"
              />
              {errors.address && errors.address.type === 'required' && (
                <span role="alert">This is required</span>
              )}
              {errors.address && errors.address.type === 'maxLength' && (
                <span role="alert">Max length exceeded</span>
              )}
            </div>
            <div className="form-group">
              <label>UF:</label>
              <select
                name="uf"
                className="form-control"
                ref={register({ required: true })}
                defaultValue={''}
                onChange={(e) => setUf(e.currentTarget.value)}
              >
                <option value=""></option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sigla}
                  </option>
                ))}
              </select>
              {errors.uf && errors.uf.type === 'required' && (
                <span role="alert">This is required</span>
              )}
            </div>
            <div className="form-group">
              <label>City:</label>
              <select
                name="city"
                className="form-control"
                ref={register({ required: true })}
              >
                {cities.map((city) => (
                  <option key={city.id}>{city.nome}</option>
                ))}
              </select>
              {errors.city && errors.city.type === 'required' && (
                <span role="alert">This is required</span>
              )}
            </div>
            <div className="form-group">
              <label>ZIP code:</label>
              <input
                name="zipcode"
                className="form-control"
                ref={register({ required: true })}
                placeholder="ZIP Code"
              />
              {errors.zipcode && errors.zipcode.type === 'required' && (
                <span role="alert">This is required</span>
              )}
            </div>
            <div className="form-check">
              <div className="row">
                <div className="col">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="default_shipping"
                    ref={register}
                  />
                  <label className="form-check-label">Default Shipping</label>
                </div>
                <div className="col">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="billing_address"
                    ref={register}
                  />
                  <label className="form-check-label">Billing Address</label>
                </div>
              </div>
            </div>

            <br />
            <input type="submit" className="btn btn-primary" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
