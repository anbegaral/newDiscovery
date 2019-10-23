import { Audioguide, POI } from './models';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AudioguideService {
  selectedAudioguide: Audioguide = new Audioguide();

  constructor(private firebase: AngularFireDatabase ) { }

  getAudioguideList(): Observable<Audioguide[]> {
    return this.firebase.list<Audioguide>('audioguides').snapshotChanges().pipe(map(actions =>
        actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
  }

  getAudioguideListByLocation(idLocation: string): Observable<Audioguide[]> {
    return this.firebase.list<Audioguide>('audioguides', query =>
    query.orderByChild('idLocation').equalTo(idLocation)).snapshotChanges().pipe(map(actions =>
        actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
  }

  getPoiList(idAudioguide: string): Observable<POI[]> {
    return this.firebase.list<POI>('poi', query =>
    query.orderByChild('idAudioguide').equalTo(idAudioguide)).snapshotChanges().pipe(map(actions =>
        actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
  }

  getAudioguide(idAudioguide: string) {
    return this.firebase.list<Audioguide>('audioguides', query =>
    query.orderByKey().equalTo(idAudioguide)).snapshotChanges().pipe(map(actions =>
        actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
  }

  searchGuides(start, end): AngularFireList<Audioguide> {
    return this.firebase.list('audioguides', query => query.orderByChild('title').startAt(start).endAt(end));
  }

  addAudioguide(audioguide: Audioguide) {
    return this.firebase.object('audioguides').set(audioguide);
  }
}
