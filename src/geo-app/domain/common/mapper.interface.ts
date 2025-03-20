export interface IMapper<Entity, DTO> {
    toDTO(entity: Entity): DTO;
    toEntity(dto: DTO, id?: string): Entity;
  }